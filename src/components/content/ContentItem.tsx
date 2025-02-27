
import { Card } from "@/components/ui/card";
import { FileText, Video, Table } from "lucide-react";

interface ContentItemProps {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
}

export const ContentItem = ({
  id,
  title,
  description,
  content_type,
  content_url,
  thumbnail_url,
}: ContentItemProps) => {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'document':
        return FileText;
      case 'spreadsheet':
        return Table;
      default:
        return FileText;
    }
  };

  const Icon = getContentIcon(content_type);

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
            <a 
              href={content_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline flex items-center"
            >
              View Content
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
