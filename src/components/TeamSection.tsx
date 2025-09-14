import { User } from "lucide-react";
import abdulkhaliqImg from "@/assets/abdulkhaliq.jpg";
import mubashirImg from "@/assets/mubashir.jpg";
import hamzaImg from "@/assets/hamza.jpg";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Abdulkhaliq Bhatti",
      role: "AI Engineer & Founder",
      image: abdulkhaliqImg
    },
    {
      name: "M. Mubashir Sheikh",
      role: "Computer Vision Specialist",
      image: mubashirImg
    },
    {
      name: "M. Hamza",
      role: "Full Stack Developer",
      image: hamzaImg
    }
  ];

  return (
    <section id="team" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-inter">
            Meet Our Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The passionate minds behind Colorify's AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-card rounded-3xl p-8 shadow-card hover:shadow-green transition-all duration-300 hover:-translate-y-2 border border-border/50 text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-4 group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2 font-inter">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {member.role}
                </p>
                
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex justify-center">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;