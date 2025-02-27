
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ContentSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ContentSearch = ({ searchQuery, setSearchQuery }: ContentSearchProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Label htmlFor="content-search" className="text-sm font-semibold">Search Content</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="content-search"
            type="search"
            placeholder="Search resources..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
