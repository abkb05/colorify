import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { colorizeImage, loadImageFromFile } from "@/lib/colorization";
import { Upload, Download, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface BatchItem {
  id: string;
  file: File;
  originalUrl: string;
  colorizedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface BatchProcessorProps {
  selectedModel: string;
  customization?: any;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ 
  selectedModel,
  customization 
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  const handleFilesSelect = useCallback((files: FileList) => {
    const newItems: BatchItem[] = Array.from(files).map((file, index) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return null;
      }

      return {
        id: `batch-${Date.now()}-${index}`,
        file,
        originalUrl: URL.createObjectURL(file),
        status: 'pending' as const,
        progress: 0,
      };
    }).filter(Boolean) as BatchItem[];

    setBatchItems(prev => [...prev, ...newItems]);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      handleFilesSelect(e.dataTransfer.files);
    }
  }, [handleFilesSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeItem = (id: string) => {
    setBatchItems(prev => {
      const item = prev.find(item => item.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.colorizedUrl) {
          URL.revokeObjectURL(item.colorizedUrl);
        }
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const processItem = async (item: BatchItem): Promise<BatchItem> => {
    try {
      setBatchItems(prev => prev.map(i => 
        i.id === item.id 
          ? { ...i, status: 'processing', progress: 0 }
          : i
      ));

      const imageElement = await loadImageFromFile(item.file);
      
      const colorizedBlob = await colorizeImage(imageElement, {
        quality: 'high',
        model: selectedModel as any,
        customization,
        onProgress: (progress) => {
          setBatchItems(prev => prev.map(i => 
            i.id === item.id 
              ? { ...i, progress }
              : i
          ));
        }
      });

      const colorizedUrl = URL.createObjectURL(colorizedBlob);
      
      return {
        ...item,
        colorizedUrl,
        status: 'completed',
        progress: 100
      };
    } catch (error) {
      console.error(`Error processing ${item.file.name}:`, error);
      return {
        ...item,
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Processing failed'
      };
    }
  };

  const processAllItems = async () => {
    if (batchItems.length === 0 || !selectedModel) return;

    setIsProcessing(true);
    setOverallProgress(0);

    const pendingItems = batchItems.filter(item => item.status === 'pending');
    
    for (let i = 0; i < pendingItems.length; i++) {
      const item = pendingItems[i];
      const processedItem = await processItem(item);
      
      setBatchItems(prev => prev.map(existing => 
        existing.id === item.id ? processedItem : existing
      ));

      setOverallProgress(((i + 1) / pendingItems.length) * 100);
    }

    setIsProcessing(false);
    
    const completedCount = batchItems.filter(item => item.status === 'completed').length;
    toast({
      title: "Batch processing completed!",
      description: `Successfully processed ${completedCount} images.`,
    });
  };

  const downloadAll = () => {
    const completedItems = batchItems.filter(item => item.colorizedUrl);
    
    completedItems.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.colorizedUrl!;
        link.download = `colorized-${item.file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100); // Stagger downloads
    });

    toast({
      title: "Download started!",
      description: `Downloading ${completedItems.length} colorized images.`,
    });
  };

  const getStatusIcon = (status: BatchItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      default:
        return null;
    }
  };

  const completedCount = batchItems.filter(item => item.status === 'completed').length;
  const pendingCount = batchItems.filter(item => item.status === 'pending').length;
  const errorCount = batchItems.filter(item => item.status === 'error').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Colorization</CardTitle>
          <CardDescription>
            Upload multiple images to colorize them all at once using the {selectedModel} model
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 text-center transition-colors"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop multiple images here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to select files
            </p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('batch-upload')?.click()}
            >
              Select Images
            </Button>
            <input
              id="batch-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
            />
          </div>

          {/* Batch Stats */}
          {batchItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Total: {batchItems.length}
              </Badge>
              <Badge variant="outline">
                Pending: {pendingCount}
              </Badge>
              <Badge variant="default">
                Completed: {completedCount}
              </Badge>
              {errorCount > 0 && (
                <Badge variant="destructive">
                  Errors: {errorCount}
                </Badge>
              )}
            </div>
          )}

          {/* Overall Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          )}

          {/* Action Buttons */}
          {batchItems.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={processAllItems}
                disabled={isProcessing || pendingCount === 0}
                className="flex-1"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Process All ({pendingCount})
              </Button>
              
              {completedCount > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadAll}
                  disabled={isProcessing}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All ({completedCount})
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Items List */}
      {batchItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {batchItems.map((item) => (
            <Card key={item.id} className="relative">
              <CardContent className="p-3">
                <div className="aspect-square relative mb-2">
                  <img
                    src={item.colorizedUrl || item.originalUrl}
                    alt={item.file.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate">
                      {item.file.name}
                    </span>
                    {getStatusIcon(item.status)}
                  </div>
                  
                  {item.status === 'processing' && (
                    <Progress value={item.progress} className="h-1" />
                  )}
                  
                  {item.error && (
                    <p className="text-xs text-destructive">
                      {item.error}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchProcessor;