
import { FileText } from "lucide-react";

interface NoContentFoundProps {
  searchQuery: string;
  selectedCategory: string;
  isConsultant: boolean;
}

export const NoContentFound = ({ searchQuery, selectedCategory, isConsultant }: NoContentFoundProps) => {
  return (
    <div className="bg-muted/30 rounded-lg p-8 text-center my-8">
      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No content found</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery || selectedCategory !== "all" 
          ? "Try changing your search or category filters" 
          : isConsultant 
            ? "Be the first to add premium business content" 
            : "Your consultant will add premium content soon"}
      </p>
    </div>
  );
};
