
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex flex-col text-left leading-tight">
            <span className="text-sm">
              <span className="text-blue-900 dark:text-blue-400 font-bold">T</span>rusted
            </span>
            <span className="text-sm">
              <span className="text-blue-900 dark:text-blue-400 font-bold">B</span>usiness
            </span>
            <span className="text-sm">
              <span className="text-blue-900 dark:text-blue-400 font-bold">A</span>dvisors
            </span>
          </a>
          <div className="hidden md:flex gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
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
