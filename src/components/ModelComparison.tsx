import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Sparkles, Palette, Camera, Zap, Brain, Cpu, Image, Star } from "lucide-react";

interface ModelConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  specialty: string;
  speed: number; // 1-5
  quality: number; // 1-5
  defaultSettings: {
    saturation: number;
    warmth: number;
    contrast: number;
    vintage: boolean;
    preservation: number;
  };
}

const COLORIZATION_MODELS: ModelConfig[] = [
  {
    id: 'deoldify',
    name: 'DeOldify',
    description: 'Vintage photo restoration with historical accuracy',
    icon: Camera,
    specialty: 'Historical Photos',
    speed: 3,
    quality: 5,
    defaultSettings: { saturation: 0.8, warmth: 1.2, contrast: 1.1, vintage: true, preservation: 0.8 }
  },
  {
    id: 'nvidia',
    name: 'NVIDIA Colorizor',
    description: 'Advanced AI with natural color mapping',
    icon: Cpu,
    specialty: 'Natural Scenes',
    speed: 4,
    quality: 5,
    defaultSettings: { saturation: 1.0, warmth: 1.0, contrast: 1.2, vintage: false, preservation: 0.9 }
  },
  {
    id: 'myheritage',
    name: 'MyHeritage Style',
    description: 'Portrait and family photo enhancement',
    icon: Star,
    specialty: 'Portraits',
    speed: 4,
    quality: 4,
    defaultSettings: { saturation: 0.9, warmth: 1.1, contrast: 1.0, vintage: false, preservation: 0.85 }
  },
  {
    id: 'hotpot',
    name: 'Hotpot.AI Style',
    description: 'Quick and vibrant colorization',
    icon: Zap,
    specialty: 'Quick Results',
    speed: 5,
    quality: 3,
    defaultSettings: { saturation: 1.3, warmth: 1.1, contrast: 1.1, vintage: false, preservation: 0.7 }
  },
  {
    id: 'algorithmia',
    name: 'Algorithmia Style',
    description: 'Professional-grade processing',
    icon: Brain,
    specialty: 'Professional',
    speed: 2,
    quality: 5,
    defaultSettings: { saturation: 1.1, warmth: 1.0, contrast: 1.3, vintage: false, preservation: 0.95 }
  },
  {
    id: 'palette',
    name: 'Palette.fm Style',
    description: 'Fine-tuned color control',
    icon: Palette,
    specialty: 'Color Control',
    speed: 3,
    quality: 4,
    defaultSettings: { saturation: 1.0, warmth: 1.0, contrast: 1.0, vintage: false, preservation: 0.8 }
  }
];

interface ModelComparisonProps {
  onModelSelect: (modelId: string, customization?: any) => void;
  isProcessing: boolean;
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  onModelSelect,
  isProcessing,
  selectedModels,
  onToggleModel
}) => {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [customSettings, setCustomSettings] = useState<Record<string, any>>({});

  const handleModelClick = (model: ModelConfig) => {
    setActiveModel(activeModel === model.id ? null : model.id);
  };

  const handleCustomizationChange = (modelId: string, setting: string, value: any) => {
    setCustomSettings(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        [setting]: value
      }
    }));
  };

  const handleProcessModel = (model: ModelConfig) => {
    const settings = {
      ...model.defaultSettings,
      ...customSettings[model.id]
    };
    onModelSelect(model.id, settings);
  };

  const renderQualityBadges = (speed: number, quality: number) => (
    <div className="flex gap-2">
      <Badge variant="outline" className="text-xs">
        Speed: {"⚡".repeat(speed)}
      </Badge>
      <Badge variant="outline" className="text-xs">
        Quality: {"⭐".repeat(quality)}
      </Badge>
    </div>
  );

  const renderCustomizationControls = (model: ModelConfig) => {
    const settings = { ...model.defaultSettings, ...customSettings[model.id] };
    
    return (
      <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
        <h4 className="font-semibold text-sm">Customize {model.name}</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Saturation: {settings.saturation.toFixed(1)}</Label>
            <Slider
              value={[settings.saturation]}
              onValueChange={([value]) => handleCustomizationChange(model.id, 'saturation', value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-xs">Warmth: {settings.warmth.toFixed(1)}</Label>
            <Slider
              value={[settings.warmth]}
              onValueChange={([value]) => handleCustomizationChange(model.id, 'warmth', value)}
              min={0.5}
              max={1.5}
              step={0.1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-xs">Contrast: {settings.contrast.toFixed(1)}</Label>
            <Slider
              value={[settings.contrast]}
              onValueChange={([value]) => handleCustomizationChange(model.id, 'contrast', value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-xs">Detail Preservation: {settings.preservation.toFixed(1)}</Label>
            <Slider
              value={[settings.preservation]}
              onValueChange={([value]) => handleCustomizationChange(model.id, 'preservation', value)}
              min={0}
              max={1}
              step={0.05}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id={`vintage-${model.id}`}
              checked={settings.vintage}
              onCheckedChange={(checked) => handleCustomizationChange(model.id, 'vintage', checked)}
            />
            <Label htmlFor={`vintage-${model.id}`} className="text-xs">Vintage Effect</Label>
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => handleProcessModel(model)}
          disabled={isProcessing}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Process with {model.name}
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Choose Your Colorization Model</h3>
        <p className="text-sm text-muted-foreground">
          Each model specializes in different types of images and styles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLORIZATION_MODELS.map((model) => {
          const Icon = model.icon;
          const isActive = activeModel === model.id;
          
          return (
            <Card 
              key={model.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isActive ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader className="pb-3" onClick={() => handleModelClick(model)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{model.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {model.specialty}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <CardDescription className="text-xs">
                  {model.description}
                </CardDescription>
                
                {renderQualityBadges(model.speed, model.quality)}
              </CardHeader>
              
              {isActive && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  {renderCustomizationControls(model)}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
      <div className="text-center">
        <Button 
          variant="hero" 
          size="lg"
          onClick={() => onModelSelect('ensemble')}
          disabled={isProcessing}
          className="px-8"
        >
          <Brain className="mr-2 h-5 w-5" />
          Auto-Select Best Model
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Our AI will automatically choose and blend the best models for your image
        </p>
      </div>
    </div>
  );
};

export default ModelComparison;