
import { Card } from "@/components/ui/card";

export const PopularResources = () => {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-3">Popular Resources</h3>
      <div className="space-y-3">
        {[
          { title: "2023 Business Trends", type: "Document" },
          { title: "Marketing Strategy Template", type: "Spreadsheet" },
          { title: "Customer Acquisition Webinar", type: "Video" },
        ].map((resource, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <a href="#" className="text-sm hover:underline hover:text-primary transition-colors">
              {resource.title}
              <span className="text-xs text-muted-foreground ml-1">({resource.type})</span>
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
};
