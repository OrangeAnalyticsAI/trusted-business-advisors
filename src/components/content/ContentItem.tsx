
import { Card } from "@/components/ui/card";
import { FileText, Video, Table, Presentation, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = content_url;
      
      // Instead of just setting the download attribute, we need to actually
      // fetch the file and use the Blob API to trigger the download with the proper name
      fetch(content_url)
        .then(response => response.blob())
        .then(blob => {
          // Create a blob URL for the file
          const blobUrl = URL.createObjectURL(blob);
          
          // Update the link to use the blob URL
          link.href = blobUrl;
          
          // Set the download attribute with the original filename
          link.download = original_filename;
          
          // Append to the body, click, then remove
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
          // Fallback to original behavior
          window.open(content_url, '_blank');
        });
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
              variant="link" 
              className="p-0 h-auto text-primary text-sm hover:underline"
              onClick={handleViewContent}
            >
              View Content {original_filename ? `(${original_filename})` : ''}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
