import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-light/30 to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-primary p-4 rounded-2xl shadow-green">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-inter">
            Bring Black & White
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Photos to Life
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your vintage memories with AI-powered colorization. 
            Upload, click, and watch history come alive in vivid color.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" className="text-lg px-8 py-4">
              <Upload className="mr-2 h-5 w-5" />
              Upload Your Photo
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              View Samples
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>✨ Free to try • No signup required • Professional results</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;