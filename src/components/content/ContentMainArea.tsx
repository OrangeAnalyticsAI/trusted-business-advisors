
import { Loader2 } from "lucide-react";
import { ContentItemsGrid } from "./ContentItemsGrid";
import { NoContentFound } from "./NoContentFound";

interface ContentItem {
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

interface UserProfile {
  id: string;
  user_type: 'client' | 'consultant';
  email: string;
  full_name?: string;
}

interface ContentMainAreaProps {
  loading: boolean;
  contentItems: ContentItem[];
  userProfile: UserProfile | null;
  isConsultant: boolean;
  searchQuery: string;
  selectedCategory: string;
  onContentDeleted?: () => void;
}

export const ContentMainArea = ({
  loading,
  contentItems,
  userProfile,
  isConsultant,
  searchQuery,
  selectedCategory,
  onContentDeleted,
}: ContentMainAreaProps) => {
  return (
    <div className="lg:col-span-3">
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {contentItems.length > 0 && (
            <ContentItemsGrid 
              items={contentItems} 
              title="Recent Uploads" 
              isConsultant={isConsultant}
              onDelete={onContentDeleted}
            />
          )}

          {!loading && contentItems.length === 0 && (
            <NoContentFound 
              searchQuery={searchQuery} 
              selectedCategory={selectedCategory} 
              isConsultant={isConsultant} 
            />
          )}
        </>
      )}
    </div>
  );
};
