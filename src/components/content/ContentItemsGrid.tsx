
import { ContentItem } from "./ContentItem";

interface ContentItemData {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  original_filename?: string;
}

interface ContentItemsGridProps {
  items: ContentItemData[];
  title?: string;
  isConsultant?: boolean;
  onDelete?: () => void;
}

export const ContentItemsGrid = ({ items, title, isConsultant = false, onDelete }: ContentItemsGridProps) => {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="mb-12">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ContentItem 
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            content_type={item.content_type}
            content_url={item.content_url}
            thumbnail_url={item.thumbnail_url}
            original_filename={item.original_filename}
            isConsultant={isConsultant}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};
