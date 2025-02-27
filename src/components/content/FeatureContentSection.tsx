
import { Card } from "@/components/ui/card";
import { FileText, Table, Video } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FeatureContentSectionProps {
  title: string;
  items: { title: string; description: string }[];
  icon: "document" | "spreadsheet" | "video";
}

export const FeatureContentSection = ({ title, items, icon }: FeatureContentSectionProps) => {
  const IconComponent = icon === "video" ? Video : icon === "spreadsheet" ? Table : FileText;
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          icon === "video" ? (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:cursor-help">{item.title}</h3>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px] break-words">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-muted-foreground text-sm line-clamp-2 hover:cursor-help">{item.description}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px] break-words">
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          ) : (
            <Card key={i} className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:cursor-help">{item.title}</h3>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px] break-words">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-muted-foreground text-sm line-clamp-2 hover:cursor-help">{item.description}</p>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[300px] break-words">
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Card>
          )
        ))}
      </div>
    </section>
  );
};
