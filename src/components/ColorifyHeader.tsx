import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const ColorifyHeader = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground font-inter">
              Colorify
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#samples" className="text-muted-foreground hover:text-foreground transition-smooth">
              Samples
            </a>
            <a href="#process" className="text-muted-foreground hover:text-foreground transition-smooth">
              How It Works
            </a>
            <a href="#team" className="text-muted-foreground hover:text-foreground transition-smooth">
              Team
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
              Contact
            </a>
          </nav>
          
          <Button variant="hero" className="hidden md:flex">
            Try Now
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ColorifyHeader;