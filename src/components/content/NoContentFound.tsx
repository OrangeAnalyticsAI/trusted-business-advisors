
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
      <p className="text-muted-foreground mb-4">
        {searchQuery || selectedCategory !== "all" 
          ? "Try changing your search or category filters" 
          : isConsultant 
            ? "Be the first to add premium business content" 
            : "Your consultant will add premium content soon"}
      </p>
      {isConsultant && (
        <div className="text-sm text-amber-600 dark:text-amber-400 mt-2">
          <p>If you're having trouble uploading content, please make sure:</p>
          <ul className="list-disc list-inside text-left mt-2">
            <li>Your file size is reasonable (under 100MB)</li>
            <li>You're connected to the internet</li>
            <li>You've filled out all required fields</li>
            <li>The Edge Function is properly deployed and configured</li>
            <li>Your Supabase project has the correct storage buckets created</li>
          </ul>
        </div>
      )}
    </div>
  );
};
