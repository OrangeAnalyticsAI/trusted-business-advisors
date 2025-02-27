
import { FileText } from "lucide-react";

export const ContentHeader = () => {
  return (
    <section className="h-[200px] sm:h-[150px] mt-16 pt-16 sm:pt-0 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary/20 to-background z-0 animate-[gradient_8s_ease_infinite]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(225deg,_#FFE29F_0%,_#FFA99F_48%,_#FF719A_100%)] opacity-20 dark:opacity-10 z-0"></div>
      <div className="absolute inset-0 backdrop-blur-[120px] z-0"></div>
      <div className="container relative z-10">
        <div className="text-center animate-in">
          <div className="relative inline-block">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Premium Business
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"> Content</span>
            </h1>
            <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-primary/20 to-primary/0 blur-2xl -z-10 animate-pulse"></div>
          </div>
          <p className="mt-4 text-base text-muted-foreground">
            Expert insights and handpicked resources, carefully curated for you
          </p>
        </div>
      </div>
    </section>
  );
};
