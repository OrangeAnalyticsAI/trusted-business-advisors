
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Try to get the saved theme from localStorage, default to light if not found
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme === "dark" || savedTheme === "light") ? savedTheme : "light";
  });

  // Initial theme setup
  useEffect(() => {
    // Apply the saved theme on component mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Save theme preference to localStorage
    localStorage.setItem("theme", newTheme);
    
    // Toggle the dark class on the document
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full transition-transform hover:scale-110"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
