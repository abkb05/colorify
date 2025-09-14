import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Sparkles, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { colorizeImage, loadImageFromURL } from "@/lib/colorization";

const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
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

  const handleColorize = async (selectedModel: 'deoldify' | 'opencv' | 'pytorch' | 'ensemble' = 'ensemble') => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Load the uploaded image
      const imageElement = await loadImageFromURL(uploadedImage!);
      
      // Colorize the image using our advanced pipeline with selected model
      const colorizedBlob = await colorizeImage(imageElement, {
        quality: 'high',
        model: selectedModel,
        onProgress: (progress) => setProcessingProgress(progress)
      });
      
      // Create a URL for the colorized image
      const colorizedUrl = URL.createObjectURL(colorizedBlob);
      setColorizedImage(colorizedUrl);
      
      toast({
        title: "Colorization complete!",
        description: `Your photo has been professionally colorized using ${selectedModel.toUpperCase()} model with natural, realistic colors.`,
      });
      
    } catch (error) {
      console.error('Colorization error:', error);
      toast({
        title: "Colorization failed",
        description: "There was an error processing your image. Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    if (colorizedImage) {
      URL.revokeObjectURL(colorizedImage);
    }
    setColorizedImage(null);
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  const downloadImage = () => {
    if (colorizedImage) {
      const link = document.createElement('a');
      link.href = colorizedImage;
      link.download = 'colorized-photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started!",
        description: "Your colorized photo is being downloaded.",
      });
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-inter">
              Professional AI Colorization
            </h2>
            <p className="text-xl text-muted-foreground">
              Transform your black & white images with realistic, natural colors using advanced AI
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
                      Upload JPG, PNG, or WEBP files for professional AI colorization
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
                {!colorizedImage ? (
                  // Show original image before colorization
                  <>
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
                     
                     <div className="text-center space-y-6">
                       <div>
                         <h3 className="text-lg font-semibold text-foreground mb-3">Choose AI Model:</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                           <Button
                             variant="outline"
                             onClick={() => handleColorize('deoldify')}
                             disabled={isProcessing}
                             className="flex flex-col items-center p-4 h-auto hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                           >
                             <div className="font-semibold">DeOldify</div>
                             <div className="text-xs text-muted-foreground mt-1">Vintage Style</div>
                           </Button>
                           <Button
                             variant="outline"
                             onClick={() => handleColorize('opencv')}
                             disabled={isProcessing}
                             className="flex flex-col items-center p-4 h-auto hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                           >
                             <div className="font-semibold">OpenCV</div>
                             <div className="text-xs text-muted-foreground mt-1">Sharp & Clean</div>
                           </Button>
                           <Button
                             variant="outline"
                             onClick={() => handleColorize('pytorch')}
                             disabled={isProcessing}
                             className="flex flex-col items-center p-4 h-auto hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                           >
                             <div className="font-semibold">PyTorch</div>
                             <div className="text-xs text-muted-foreground mt-1">Vibrant Colors</div>
                           </Button>
                           <Button
                             variant="hero"
                             onClick={() => handleColorize('ensemble')}
                             disabled={isProcessing}
                             className="flex flex-col items-center p-4 h-auto transition-all duration-300 hover:scale-105"
                           >
                             <div className="font-semibold">Best Quality</div>
                             <div className="text-xs mt-1">All Models</div>
                           </Button>
                         </div>
                       </div>
                       
                       {isProcessing && (
                         <div className="max-w-md mx-auto bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                           <div className="flex items-center justify-center space-x-3 mb-3">
                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                             <span className="text-foreground font-semibold">Processing with AI ({processingProgress}%)</span>
                           </div>
                           <div className="bg-secondary rounded-full h-3 overflow-hidden">
                             <div 
                               className="bg-gradient-primary h-full transition-all duration-500 ease-out"
                               style={{ width: `${processingProgress}%` }}
                             />
                           </div>
                           <p className="text-sm text-muted-foreground mt-3 text-center">
                             {processingProgress < 20 ? 'Initializing professional AI models...' :
                              processingProgress < 40 ? 'Analyzing image characteristics...' :
                              processingProgress < 60 ? 'Applying intelligent color mapping...' :
                              processingProgress < 80 ? 'Enhancing color accuracy...' :
                              processingProgress < 95 ? 'Finalizing professional results...' :
                              'Almost complete...'}
                           </p>
                         </div>
                       )}
                     </div>
                  </>
                ) : (
                  // Show side-by-side comparison after colorization
                  <>
                    <div className="relative">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-4 right-4 z-10"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-foreground text-center">Original</h3>
                          <img
                            src={uploadedImage}
                            alt="Original black and white"
                            className="w-full rounded-2xl shadow-lg filter grayscale"
                          />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-foreground text-center">Colorized</h3>
                          <img
                            src={colorizedImage}
                            alt="Colorized"
                            className="w-full rounded-2xl shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <Button
                        variant="hero"
                        size="lg"
                        onClick={downloadImage}
                        className="px-12"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Colorized Photo
                      </Button>
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setColorizedImage(null);
                            setIsProcessing(false);
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadZone;