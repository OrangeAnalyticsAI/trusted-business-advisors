
import { Card } from "@/components/ui/card";
import { FileText, Video, Table, Presentation, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContentItemProps {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
  original_filename?: string;
}

export const ContentItem = ({
  id,
  title,
  description,
  content_type,
  content_url,
  thumbnail_url,
  original_filename,
}: ContentItemProps) => {
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
      // Use XMLHttpRequest with responseType 'blob' to force download with proper filename
      const xhr = new XMLHttpRequest();
      xhr.open('GET', content_url, true);
      xhr.responseType = 'blob';
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          // Create blob link to download
          const blob = new Blob([xhr.response], { type: xhr.getResponseHeader('content-type') });
          const url = window.URL.createObjectURL(blob);
          
          // Create temp link
          const link = document.createElement('a');
          link.href = url;
          link.download = original_filename;
          
          // Append to html
          document.body.appendChild(link);
          
          // Force download
          link.click();
          
          // Clean up and remove the link
          link.parentNode?.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast.success(`Downloading ${original_filename}`);
        } else {
          toast.error("Download failed");
          window.open(content_url, '_blank');
        }
      };
      
      xhr.onerror = function() {
        toast.error("Download failed");
        window.open(content_url, '_blank');
      };
      
      xhr.send();
    } else {
      // Fall back to normal behavior if no original filename
      window.open(content_url, '_blank');
    }
  };

  return (
    <Card key={id} className="overflow-hidden">
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
      <div className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
        {content_url && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="text-primary text-sm gap-2"
              onClick={handleViewContent}
            >
              {original_filename ? 'Download' : 'View'} {original_filename ? '(' + original_filename + ')' : ''}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
