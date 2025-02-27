
import { Card } from "@/components/ui/card";
import { FileText, Video, Table, Presentation, FileType, Trash2, Download, Pencil, Gift, PoundSterling } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EditContentDialog } from "./EditContentDialog";

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
  is_premium?: boolean;
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
  is_premium = false,
  onDelete,
}: ContentItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
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
          const extractedCategories = data
            .map(item => item.categories as Category)
            .filter(Boolean);
          
          setCategories(extractedCategories);
        }
      } catch (err) {
        console.error("Error in categories fetch:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
    
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
      const link = document.createElement('a');
      link.href = content_url;
      link.setAttribute('download', original_filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${original_filename}`);
    } else {
      window.open(content_url, '_blank');
    }
  };
  
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    try {
      setIsDeleting(true);
      
      const contentUrlPath = content_url ? new URL(content_url).pathname.split('/').pop() : null;
      const thumbnailUrlPath = thumbnail_url ? new URL(thumbnail_url).pathname.split('/').pop() : null;
      
      const { error: dbError } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (dbError) {
        throw new Error(`Error deleting from database: ${dbError.message}`);
      }
      
      if (contentUrlPath) {
        const { error: contentError } = await supabase.storage
          .from('content_files')
          .remove([contentUrlPath]);
          
        if (contentError) {
          console.error('Error deleting content file:', contentError);
        }
      }
      
      if (thumbnailUrlPath) {
        const { error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .remove([thumbnailUrlPath]);
          
        if (thumbnailError) {
          console.error('Error deleting thumbnail:', thumbnailError);
        }
      }
      
      toast.success("Content deleted successfully");
      
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
    <>
      <Card key={id} className="overflow-hidden flex flex-col">
        <div className="aspect-[5/3] bg-muted relative flex items-center justify-center overflow-hidden">
          {thumbnail_url ? (
            <img 
              src={thumbnail_url} 
              alt={title} 
              className="w-full h-full object-cover absolute inset-0" 
            />
          ) : (
            <Icon className="h-12 w-12 text-muted-foreground" />
          )}
          {/* Premium badge in top right corner */}
          {is_premium ? (
            <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1">
              <PoundSterling className="h-4 w-4" />
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Gift className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="p-4 flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold line-clamp-2 hover:cursor-help">{title}</h3>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[300px] break-words">
                  <p>{title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2 hover:cursor-help">{description}</p>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[300px] break-words">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {categories.length > 0 && (
            <div className="h-[50px] overflow-hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-wrap gap-1 mb-3 line-clamp-2 hover:cursor-help">
                      {categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[300px]">
                    <div className="flex flex-wrap gap-1">
                      {categories.map((category) => (
                        <Badge key={category.id} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        {content_url && (
          <div className="p-4 pt-0 mt-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
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
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={is_premium 
                          ? "bg-green-500/10 border-green-500/20 hover:bg-green-500/20 hover:text-green-500 transition-all duration-200" 
                          : "bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20 hover:text-pink-500 transition-all duration-200"
                        }
                      >
                        {is_premium ? (
                          <PoundSterling className="h-4 w-4 text-green-500" />
                        ) : (
                          <Gift className="h-4 w-4 text-pink-500" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{is_premium ? 'Premium Content' : 'Free Content'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {isConsultant && (
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-500 transition-all duration-200"
                          onClick={() => setEditDialogOpen(true)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit content</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
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
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
      
      <EditContentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        contentId={id}
        initialTitle={title}
        initialDescription={description}
        initialThumbnailUrl={thumbnail_url}
        initialIsPremium={is_premium}
        onUpdate={() => {
          if (onDelete) {
            onDelete();
          }
        }}
      />
    </>
  );
};
