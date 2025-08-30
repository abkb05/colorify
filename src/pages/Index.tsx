import ColorifyHeader from "@/components/ColorifyHeader";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import UploadZone from "@/components/UploadZone";
import SamplesSlider from "@/components/SamplesSlider";
import TeamSection from "@/components/TeamSection";
import ContactForm from "@/components/ContactForm";
import ColorifyFooter from "@/components/ColorifyFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      <ColorifyHeader />
      <main>
        <HeroSection />
        <ProcessSteps />
        <UploadZone />
        <SamplesSlider />
        <TeamSection />
        <ContactForm />
      </main>
      <ColorifyFooter />
    </div>
  );
};

export default Index;