
import { Card } from "@/components/ui/card";
import { FileText, Video, Table, Presentation, FileType, Trash2, Download, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Category {
  id: string;
  name: string;
}

interface ContentItemProps {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
  original_filename?: string;
  isConsultant?: boolean;
  onDelete?: () => void;
}

export const ContentItem = ({
  id,
  title,
  description,
  content_type,
  content_url,
  thumbnail_url,
  original_filename,
  isConsultant = false,
  onDelete,
}: ContentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        
        const { data, error } = await supabase
          .from('content_categories')
          .select(`
            category_id,
            categories:category_id(id, name)
          `)
          .eq('content_id', id);
          
        if (error) {
          console.error("Error fetching content categories:", error);
        } else {
          // Extract the categories from the joined query
          const extractedCategories = data
            .map(item => item.categories as Category)
            .filter(Boolean); // Remove any null values
          
          setCategories(extractedCategories);
        }
      } catch (err) {
        console.error("Error in categories fetch:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('content-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_categories',
          filter: `content_id=eq.${id}`
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);
  
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'document':
        return FileText;
      case 'spreadsheet':
        return Table;
      case 'presentation':
        return Presentation;
      default:
        return FileType;
    }
  };

  const Icon = getContentIcon(content_type);

  const handleViewContent = () => {
    if (!content_url) return;
    
    if (original_filename) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = content_url;
      
      // Set the download attribute with the original filename
      link.setAttribute('download', original_filename);
      
      // Append, click, then remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      // Show success toast
      toast.success(`Downloading ${original_filename}`);
    } else {
      // Fall back to normal behavior if no original filename
      window.open(content_url, '_blank');
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    try {
      setIsDeleting(true);
      
      // Extract the file path from the content_url
      const contentUrlPath = content_url ? new URL(content_url).pathname.split('/').pop() : null;
      const thumbnailUrlPath = thumbnail_url ? new URL(thumbnail_url).pathname.split('/').pop() : null;
      
      // Delete from the database first
      const { error: dbError } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        throw new Error(`Error deleting from database: ${dbError.message}`);
      }
      
      // Delete files from storage if they exist
      if (contentUrlPath) {
        const { error: contentError } = await supabase.storage
          .from('content_files')
          .remove([contentUrlPath]);
          
        if (contentError) {
          console.error('Error deleting content file:', contentError);
          // Continue even if file deletion fails
        }
      }
      
      if (thumbnailUrlPath) {
        const { error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .remove([thumbnailUrlPath]);
          
        if (thumbnailError) {
          console.error('Error deleting thumbnail:', thumbnailError);
          // Continue even if thumbnail deletion fails
        }
      }
      
      toast.success("Content deleted successfully");
      
      // Call onDelete callback if provided
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card key={id} className="overflow-hidden flex flex-col">
      <div className="aspect-video bg-muted relative flex items-center justify-center">
        {thumbnail_url ? (
          <img 
            src={thumbnail_url} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <Icon className="h-12 w-12 text-muted-foreground" />
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{description}</p>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {content_url && (
        <div className="p-4 pt-0 mt-auto border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-primary/10 border-primary/20 hover:bg-primary/20 hover:text-primary transition-all duration-200"
                    onClick={handleViewContent}
                  >
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{original_filename ? `Download ${original_filename}` : 'View content'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {isConsultant && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-destructive/10 border-destructive/20 hover:bg-destructive/20 hover:text-destructive transition-all duration-200"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
