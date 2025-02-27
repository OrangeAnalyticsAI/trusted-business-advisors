
import { ContentSearch } from "./ContentSearch";
import { ContentCategories } from "./ContentCategories";
import { ConsultantTools } from "./ConsultantTools";
import { PopularResources } from "./PopularResources";

interface Category {
  id: string;
  name: string;
}

interface ContentSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isConsultant: boolean;
  onContentAdded: () => void;
}

export const ContentSidebar = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  isConsultant,
  onContentAdded,
}: ContentSidebarProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <ContentSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <ContentCategories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        {isConsultant && (
          <ConsultantTools onContentAdded={onContentAdded} />
        )}
        
        <PopularResources />
      </div>
    </div>
  );
};
