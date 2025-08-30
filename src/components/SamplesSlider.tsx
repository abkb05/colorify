import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import sample images
import sampleBw1 from "@/assets/sample-bw-1.jpg";
import sampleColor1 from "@/assets/sample-color-1.jpg";
import sampleBw2 from "@/assets/sample-bw-2.jpg";
import sampleColor2 from "@/assets/sample-color-2.jpg";
import sampleBw3 from "@/assets/sample-bw-3.jpg";
import sampleColor3 from "@/assets/sample-color-3.jpg";

const SamplesSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBefore, setShowBefore] = useState<{[key: number]: boolean}>({
    0: true,
    1: true,
    2: true
  });

  const samples = [
    {
      before: sampleBw1,
      after: sampleColor1,
      title: "Classic Portrait"
    },
    {
      before: sampleBw2,
      after: sampleColor2,
      title: "Vintage Fashion"
    },
    {
      before: sampleBw3,
      after: sampleColor3,
      title: "Family Memory"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % samples.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + samples.length) % samples.length);
  };

  const toggleView = (index: number) => {
    setShowBefore(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="samples" className="py-20 bg-gradient-to-br from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-inter">
            See the Magic
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how our AI transforms black & white photos into vibrant, colorful memories
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main slider */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {samples.map((sample, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-card p-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                          <h3 className="text-3xl font-bold text-foreground font-inter">
                            {sample.title}
                          </h3>
                          <p className="text-muted-foreground text-lg">
                            Click the toggle below to see the transformation
                          </p>
                          <Button
                            variant="hero"
                            onClick={() => toggleView(index)}
                            className="w-full md:w-auto"
                          >
                            {showBefore[index] ? "Show Colorized" : "Show Original"}
                          </Button>
                        </div>
                        
                        <div className="relative">
                          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
                            <img
                              src={showBefore[index] ? sample.before : sample.after}
                              alt={`${sample.title} - ${showBefore[index] ? 'Before' : 'After'}`}
                              className="w-full h-80 object-cover transition-all duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {showBefore[index] ? "Original" : "Colorized"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/90 hover:bg-background shadow-lg"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {samples.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-primary/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SamplesSlider;