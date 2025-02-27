
import { Loader2 } from "lucide-react";
import { ContentItemsGrid } from "./ContentItemsGrid";
import { NoContentFound } from "./NoContentFound";
import { DebugInfo } from "./DebugInfo";
import { FeatureContentSection } from "./FeatureContentSection";

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
          <DebugInfo userProfile={userProfile} isConsultant={isConsultant} />
        
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

          <FeatureContentSection 
            title="Expert Video Resources"
            icon="video"
            items={[
              { 
                title: "Business Strategy Session 1", 
                description: "Expert insights on growing your business in today's market." 
              },
              { 
                title: "Business Strategy Session 2", 
                description: "Expert insights on growing your business in today's market." 
              },
              { 
                title: "Business Strategy Session 3", 
                description: "Expert insights on growing your business in today's market." 
              }
            ]}
          />

          <FeatureContentSection 
            title="Professional Documents"
            icon="document"
            items={[
              { 
                title: "Business Plan Template 1", 
                description: "Professional templates and guides for business planning." 
              },
              { 
                title: "Business Plan Template 2", 
                description: "Professional templates and guides for business planning." 
              },
              { 
                title: "Business Plan Template 3", 
                description: "Professional templates and guides for business planning." 
              }
            ]}
          />

          <FeatureContentSection 
            title="Spreadsheet Templates"
            icon="spreadsheet"
            items={[
              { 
                title: "Financial Analysis Template 1", 
                description: "Ready-to-use spreadsheets for financial planning and analysis." 
              },
              { 
                title: "Financial Analysis Template 2", 
                description: "Ready-to-use spreadsheets for financial planning and analysis." 
              },
              { 
                title: "Financial Analysis Template 3", 
                description: "Ready-to-use spreadsheets for financial planning and analysis." 
              }
            ]}
          />
        </>
      )}
    </div>
  );
};
