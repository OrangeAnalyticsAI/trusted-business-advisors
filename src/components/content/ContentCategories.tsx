
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Filter, Tag, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ContentCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedMetaCategories: string[];
  setSelectedMetaCategories: (categories: string[]) => void;
}

export const ContentCategories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedMetaCategories,
  setSelectedMetaCategories,
}: ContentCategoriesProps) => {
  const [metaCategories, setMetaCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Fetch metadata categories from the database
  useEffect(() => {
    const fetchMetaCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (error) {
          console.error("Error fetching meta categories:", error);
        } else {
          setMetaCategories(data || []);
        }
      } catch (err) {
        console.error("Error in meta categories fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetaCategories();
  }, []);
  
  const handleToggleMetaCategory = (categoryId: string) => {
    if (selectedMetaCategories.includes(categoryId)) {
      setSelectedMetaCategories(selectedMetaCategories.filter(id => id !== categoryId));
    } else {
      setSelectedMetaCategories([...selectedMetaCategories, categoryId]);
    }
  };
  
  const clearMetaCategories = () => {
    setSelectedMetaCategories([]);
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category.id
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted/50 text-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {metaCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center">
              <Tag className="h-4 w-4 mr-1" /> 
              Topic Categories
            </h3>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {expanded ? 'Hide' : 'Show all'}
            </button>
          </div>
          
          {selectedMetaCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mb-2">
              <div className="flex items-center w-full justify-between mb-1">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                <button
                  onClick={clearMetaCategories}
                  className="text-xs flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  Clear <X className="h-3 w-3 ml-1" />
                </button>
              </div>
              
              {selectedMetaCategories.map(selectedId => {
                const category = metaCategories.find(c => c.id === selectedId);
                if (!category) return null;
                
                return (
                  <Badge 
                    key={`selected-${category.id}`} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleToggleMetaCategory(category.id)}
                  >
                    {category.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          )}
          
          <div className={`flex flex-wrap gap-1 ${expanded ? '' : 'max-h-16 overflow-hidden'}`}>
            {metaCategories.map((category) => (
              <Badge 
                key={category.id} 
                variant={selectedMetaCategories.includes(category.id) ? "default" : "outline"}
                className={`cursor-pointer ${selectedMetaCategories.includes(category.id) 
                  ? 'hover:bg-primary/80' 
                  : 'hover:bg-secondary/50'}`}
                onClick={() => handleToggleMetaCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
