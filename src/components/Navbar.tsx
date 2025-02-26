
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 ml-[220px]">
          <div className="hidden md:flex gap-6">
            <a href="/content" className="text-muted-foreground hover:text-primary transition-colors">
              Content
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#consultation" className="text-muted-foreground hover:text-primary transition-colors">
              Book a consultation
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
