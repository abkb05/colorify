import { Upload, Sparkles, Eye, Download } from "lucide-react";

const ProcessSteps = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Select your black & white photo from your device",
      step: "01"
    },
    {
      icon: Sparkles,
      title: "Colorize",
      description: "Our AI analyzes and adds realistic colors automatically",
      step: "02"
    },
    {
      icon: Eye,
      title: "Compare",
      description: "View before & after side-by-side to see the transformation",
      step: "03"
    },
    {
      icon: Download,
      title: "Download",
      description: "Save your colorized photo in high resolution",
      step: "04"
    }
  ];

  return (
    <section id="process" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-inter">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your memories in just four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-green transition-all duration-300 hover:-translate-y-2 border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-gradient-primary p-3 rounded-xl">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-bold text-primary/20 font-inter">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="text-2xl font-semibold text-foreground mb-3 font-inter">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;