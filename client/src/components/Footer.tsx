import { Link } from "wouter";
import { Dumbbell, Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
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
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
      bgColor: "bg-pink-600 hover:bg-pink-700",
    },
    {
      name: "Twitter",
      href: "#",
      icon: Twitter,
      bgColor: "bg-blue-400 hover:bg-blue-500",
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
      bgColor: "bg-red-600 hover:bg-red-700",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup would be implemented here
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">FitHub</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Transform your body, elevate your mind, and join a community that celebrates 
              every victory on your fitness journey.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 ${social.bgColor} text-white rounded-lg flex items-center justify-center transition-colors`}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href}>
                    <a className="text-gray-300 hover:text-white transition-colors">
                      {service.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-orange-500 mt-0.5">📍</div>
                <div>
                  <p className="text-gray-300">123 Fitness Avenue</p>
                  <p className="text-gray-300">Health City, HC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 text-orange-500">📞</div>
                <p className="text-gray-300">(555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <p className="text-gray-300">info@fithub.com</p>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 shrink-0"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; 2024 FitHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
