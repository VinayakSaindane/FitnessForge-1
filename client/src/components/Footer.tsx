import { Link } from "wouter";
import { Dumbbell, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Classes", href: "/classes" },
    { name: "Trainers", href: "/trainers" },
    { name: "Membership", href: "/membership" },
    { name: "Contact", href: "/contact" },
  ];

  const services = [
    { name: "Personal Training", href: "/trainers" },
    { name: "Group Classes", href: "/classes" },
    { name: "Nutrition Coaching", href: "/contact" },
    { name: "Fitness Assessment", href: "/contact" },
    { name: "Recovery Programs", href: "/contact" },
    { name: "Corporate Wellness", href: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
      bgColor: "bg-blue-600/80 hover:bg-blue-600",
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
      bgColor: "bg-pink-600/80 hover:bg-pink-600",
    },
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
      bgColor: "bg-blue-400/80 hover:bg-blue-400",
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
      bgColor: "bg-red-600/80 hover:bg-red-600",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup would be implemented here
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="bg-background border-t border-white/5 py-16 relative overflow-hidden">
      {/* Subtle overlay texture/gradient */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6 group cursor-default">
              <div className="w-10 h-10 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center transition-colors group-hover:bg-primary/30">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Fitness<span className="text-primary">Forge</span></span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transform your body, elevate your mind, and join a community that celebrates
              every victory on your fitness journey.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 ${social.bgColor} text-white rounded-lg flex items-center justify-center transition-all hover:scale-110 shadow-lg`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 mr-0 transition-all group-hover:bg-primary/100 group-hover:mr-2"></span>
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href}>
                    <a className="text-muted-foreground hover:text-primary transition-colors flex items-center group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/0 mr-0 transition-all group-hover:bg-primary/100 group-hover:mr-2"></span>
                      {service.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-foreground">Contact Info</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-muted-foreground">123 Fitness Avenue</p>
                  <p className="text-muted-foreground">Health City, HC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-muted-foreground">(555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p className="text-muted-foreground">info@fitnessforge.com</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <h4 className="font-semibold mb-3 text-foreground text-sm">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            &copy; 2024 FitnessForge. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
