import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Download, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  originalImage: string;
  colorizedImage: string;
  model: string;
  timestamp: number;
  customization?: any;
}

const STORAGE_KEY = 'colorize_gallery';

export const ColorizeGallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGalleryFromStorage();
  }, []);

  const loadGalleryFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: GalleryItem[] = JSON.parse(stored);
        // Clean up old blob URLs and recreate from stored data
        setGalleryItems(items);
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const saveGalleryToStorage = (items: GalleryItem[]) => {
    try {
      // Only store metadata, not the actual blob URLs
      const itemsToStore = items.map(item => ({
        ...item,
        originalImage: '', // Don't store blob URLs
        colorizedImage: ''  // They'll be regenerated or handled differently
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToStore));
    } catch (error) {
      console.error('Error saving gallery:', error);
    }
  };

  const addToGallery = (item: Omit<GalleryItem, 'id' | 'timestamp'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gallery-${Date.now()}`,
      timestamp: Date.now(),
    };

    const updatedItems = [newItem, ...galleryItems].slice(0, 50); // Keep only last 50 items
    setGalleryItems(updatedItems);
    saveGalleryToStorage(updatedItems);

    toast({
      title: "Added to gallery!",
      description: "Your colorized image has been saved to the gallery.",
    });
  };

  const removeFromGallery = (id: string) => {
    const item = galleryItems.find(item => item.id === id);
    if (item) {
      // Clean up blob URLs
      URL.revokeObjectURL(item.originalImage);
      URL.revokeObjectURL(item.colorizedImage);
    }

    const updatedItems = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updatedItems);
    saveGalleryToStorage(updatedItems);

    toast({
      title: "Removed from gallery",
      description: "The image has been removed from your gallery.",
    });
  };

  const downloadImage = (item: GalleryItem) => {
    const link = document.createElement('a');
    link.href = item.colorizedImage;
    link.download = `colorized-${item.model}-${new Date(item.timestamp).toISOString().split('T')[0]}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started!",
      description: "Your colorized image is being downloaded.",
    });
  };

  const viewItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowDialog(true);
  };

  const clearGallery = () => {
    galleryItems.forEach(item => {
      URL.revokeObjectURL(item.originalImage);
      URL.revokeObjectURL(item.colorizedImage);
    });
    
    setGalleryItems([]);
    saveGalleryToStorage([]);
    
    toast({
      title: "Gallery cleared",
      description: "All images have been removed from the gallery.",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getModelDisplayName = (model: string) => {
    const modelNames: Record<string, string> = {
      'deoldify': 'DeOldify',
      'nvidia': 'NVIDIA',
      'myheritage': 'MyHeritage',
      'hotpot': 'Hotpot.AI',
      'algorithmia': 'Algorithmia',
      'palette': 'Palette.fm',
      'ensemble': 'Ensemble'
    };
    return modelNames[model] || model.toUpperCase();
  };

  if (galleryItems.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No images in gallery</h3>
            <p className="text-sm text-muted-foreground">
              Start colorizing images to build your gallery
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Your Colorization Gallery</h3>
        <Button variant="outline" size="sm" onClick={clearGallery}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {galleryItems.map((item) => (
          <Card key={item.id} className="group relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square relative">
                <img
                  src={item.colorizedImage}
                  alt="Colorized result"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => viewItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadImage(item)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFromGallery(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Metadata */}
              <div className="p-3 space-y-2">
                <Badge variant="secondary" className="text-xs">
                  {getModelDisplayName(item.model)}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(item.timestamp)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Colorized with {selectedItem && getModelDisplayName(selectedItem.model)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Original</h4>
                  <img
                    src={selectedItem.originalImage}
                    alt="Original"
                    className="w-full rounded-lg filter grayscale"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Colorized</h4>
                  <img
                    src={selectedItem.colorizedImage}
                    alt="Colorized"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => downloadImage(selectedItem)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export the addToGallery function for use in other components
export const useGallery = () => {
  const [, setUpdate] = useState({});
  
  const addToGallery = (item: Omit<GalleryItem, 'id' | 'timestamp'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gallery-${Date.now()}`,
      timestamp: Date.now(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existingItems: GalleryItem[] = stored ? JSON.parse(stored) : [];
      const updatedItems = [newItem, ...existingItems].slice(0, 50);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setUpdate({}); // Trigger re-render
      
      return true;
    } catch (error) {
      console.error('Error adding to gallery:', error);
      return false;
    }
  };

  return { addToGallery };
};

export default ColorizeGallery;