import { User } from "lucide-react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Abdulkhaliq Bhatti",
      role: "AI Engineer & Founder",
      initials: "AB"
    },
    {
      name: "M. Mubashir Sheikh",
      role: "Computer Vision Specialist",
      initials: "MS"
    },
    {
      name: "M. Hamza",
      role: "Full Stack Developer",
      initials: "MH"
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
                  <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-primary-foreground font-inter">
                      {member.initials}
                    </span>
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