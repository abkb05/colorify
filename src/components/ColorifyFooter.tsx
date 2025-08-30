import { Palette, Mail, Github, Twitter, Linkedin } from "lucide-react";

const ColorifyFooter = () => {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "How It Works", href: "#process" },
    { name: "Samples", href: "#samples" },
    { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" }
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@colorify.ai", label: "Email" }
  ];

  return (
    <footer className="bg-gradient-to-br from-foreground/5 to-primary/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Palette className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground font-inter">
                Colorify
              </span>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Transform your black & white memories into vibrant, colorful photos 
              with the power of artificial intelligence.
            </p>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                © 2024 Colorify. All rights reserved.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 font-inter">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 font-inter">
              Connect With Us
            </h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gradient-card p-3 rounded-xl border border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-smooth">
                Cookie Policy
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              Made with ❤️ for bringing memories to life
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ColorifyFooter;