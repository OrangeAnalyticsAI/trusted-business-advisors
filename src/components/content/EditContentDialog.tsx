
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase, generateUniqueFilename, THUMBNAILS_BUCKET } from "@/integrations/supabase/client";
import { FileImage, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface EditContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  initialTitle: string;
  initialDescription: string;
  initialThumbnailUrl?: string;
  onUpdate: () => void;
}

export function EditContentDialog({
  open,
  onOpenChange,
  contentId,
  initialTitle,
  initialDescription,
  initialThumbnailUrl,
  onUpdate,
}: EditContentDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(initialThumbnailUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return;
      }
      
      setAvailableCategories(categoriesData || []);
    };
    
    // Fetch currently selected categories for this content
    const fetchSelectedCategories = async () => {
      const { data: contentCategories, error: contentCategoriesError } = await supabase
        .from('content_categories')
        .select('category_id')
        .eq('content_id', contentId);
        
      if (contentCategoriesError) {
        console.error('Error fetching content categories:', contentCategoriesError);
        return;
      }
      
      setSelectedCategories(contentCategories.map(cc => cc.category_id));
    };
    
    if (open) {
      fetchCategories();
      fetchSelectedCategories();
      setTitle(initialTitle);
      setDescription(initialDescription);
      setThumbnailPreview(initialThumbnailUrl || null);
      setThumbnailFile(null);
    }
  }, [open, contentId, initialTitle, initialDescription, initialThumbnailUrl]);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      let thumbnailUrl = initialThumbnailUrl;
      
      // Handle thumbnail upload if a new file was selected
      if (thumbnailFile) {
        const fileName = generateUniqueFilename(thumbnailFile.name);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(THUMBNAILS_BUCKET)
          .upload(fileName, thumbnailFile);
          
        if (uploadError) {
          throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from(THUMBNAILS_BUCKET)
          .getPublicUrl(fileName);
          
        thumbnailUrl = publicUrl;
      } else if (thumbnailPreview === null && initialThumbnailUrl) {
        // If the thumbnail was cleared, remove it from the record
        thumbnailUrl = null;
        
        // Extract the file path from the URL to delete from storage
        try {
          const thumbnailPath = new URL(initialThumbnailUrl).pathname.split('/').pop();
          if (thumbnailPath) {
            // Try to delete the old thumbnail from storage, but don't block
            // if it fails - it's not critical for the update operation
            await supabase.storage
              .from(THUMBNAILS_BUCKET)
              .remove([thumbnailPath])
              .catch(err => console.error('Error removing old thumbnail:', err));
          }
        } catch (error) {
          console.error('Error parsing thumbnail URL:', error);
          // Continue with update even if we can't delete the old file
        }
      }
      
      // Update content metadata
      const { error: updateError } = await supabase
        .from('content')
        .update({
          title,
          description,
          thumbnail_url: thumbnailUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contentId);
        
      if (updateError) {
        throw new Error(`Failed to update content: ${updateError.message}`);
      }
      
      // Delete existing category associations
      const { error: deleteError } = await supabase
        .from('content_categories')
        .delete()
        .eq('content_id', contentId);
        
      if (deleteError) {
        throw new Error(`Failed to update categories: ${deleteError.message}`);
      }
      
      // Insert new category associations
      if (selectedCategories.length > 0) {
        const { error: insertError } = await supabase
          .from('content_categories')
          .insert(
            selectedCategories.map(categoryId => ({
              content_id: contentId,
              category_id: categoryId,
            }))
          );
          
        if (insertError) {
          throw new Error(`Failed to add categories: ${insertError.message}`);
        }
      }
      
      toast.success('Content updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleThumbnailSelect} 
              accept="image/*" 
              className="hidden"
            />
            
            {thumbnailPreview ? (
              <div className="relative aspect-[5/3] bg-muted rounded-md overflow-hidden mb-2">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-full object-cover"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={clearThumbnail}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="aspect-[5/3] bg-muted rounded-md flex items-center justify-center mb-2">
                <FileImage className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
              className="w-full"
            >
              {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Updating..." : "Update Content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
