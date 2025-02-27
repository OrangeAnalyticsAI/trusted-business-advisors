
import { Navbar } from "@/components/Navbar";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContentSidebar } from "@/components/content/ContentSidebar";
import { ContentMainArea } from "@/components/content/ContentMainArea";
import { useContentData } from "@/hooks/useContentData";

export default function Content() {
  const {
    searchQuery,
    setSearchQuery,
    isConsultant,
    loading,
    loadingContent,
    userProfile,
    contentItems,
    selectedMetaCategories,
    setSelectedMetaCategories,
    categories,
    selectedCategory,
    setSelectedCategory,
    fetchContent
  } = useContentData();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContentHeader />

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ContentSidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isConsultant={isConsultant}
            onContentAdded={fetchContent}
            selectedMetaCategories={selectedMetaCategories}
            setSelectedMetaCategories={setSelectedMetaCategories}
          />
          
          <ContentMainArea 
            loading={loading || loadingContent}
            contentItems={contentItems}
            userProfile={userProfile}
            isConsultant={isConsultant}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onContentDeleted={fetchContent}
          />
        </div>
      </div>
    </div>
  );
}
