
import { Card } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
}

interface ContentCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const ContentCategories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: ContentCategoriesProps) => {
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
    </Card>
  );
};
