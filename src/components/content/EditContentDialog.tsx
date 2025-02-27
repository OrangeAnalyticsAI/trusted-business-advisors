
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  onUpdate: () => void;
}

export function EditContentDialog({
  open,
  onOpenChange,
  contentId,
  initialTitle,
  initialDescription,
  onUpdate,
}: EditContentDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
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
    }
  }, [open, contentId, initialTitle, initialDescription]);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      // Update content metadata
      const { error: updateError } = await supabase
        .from('content')
        .update({
          title,
          description,
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
