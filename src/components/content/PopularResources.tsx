
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="text-sm hover:underline hover:text-primary transition-colors line-clamp-1 hover:cursor-help">
                    {resource.title}
                    <span className="text-xs text-muted-foreground ml-1">({resource.type})</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div>
                    {resource.title}
                    <span className="text-xs text-muted-foreground ml-1">({resource.type})</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </Card>
  );
};
