
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("Coming Soon", {
      description: "Jen hasn't built this yet",
      position: "top-center",
    });
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      supabase.auth.signOut().then(() => {
        toast.success("Logged out successfully");
        navigate("/");
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-lg border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 ml-[220px]">
          <div className="hidden md:flex gap-6">
            <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </a>
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
          <Button onClick={handleAuthClick} className="text-base">
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
