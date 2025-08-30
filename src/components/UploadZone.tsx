import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your photo is ready for colorization.",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
    }
  };

  const handleColorize = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Colorization complete!",
        description: "Your photo has been successfully colorized.",
      });
    }, 3000);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setIsProcessing(false);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-inter">
              Upload Your Photo
            </h2>
            <p className="text-xl text-muted-foreground">
              Drag and drop or click to select your black & white image
            </p>
          </div>

          <div className="bg-gradient-card rounded-3xl p-8 shadow-card border border-border/50">
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-primary bg-primary-light/50"
                    : "border-border hover:border-primary/50 hover:bg-accent/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gradient-primary p-4 rounded-2xl">
                    <Upload className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2 font-inter">
                      Drop your image here
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Support for JPG, PNG, and WEBP files
                    </p>
                    <Button 
                      variant="hero" 
                      size="lg"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Choose File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleColorize}
                    disabled={isProcessing}
                    className="px-12"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Colorize Photo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadZone;