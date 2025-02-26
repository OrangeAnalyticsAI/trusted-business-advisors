
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { toast } from "sonner";

export function Navbar() {
  const handleAuthClick = () => {
    toast("Coming Soon", {
      description: "Jen hasn't built this yet",
      position: "top-center",
    });
  };

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Coming Soon", {
      description: "Jen hasn't built this yet",
      position: "top-center",
    });
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 ml-[220px]">
          <div className="hidden md:flex gap-6">
            <a href="/content" className="text-muted-foreground hover:text-primary transition-colors">
              Content
            </a>
            <a href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a 
              href="#consultation" 
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={handleConsultationClick}
            >
              Book a consultation
            </a>
            <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={handleAuthClick} className="text-base">Sign In</Button>
        </div>
      </div>
    </nav>
  );
}
