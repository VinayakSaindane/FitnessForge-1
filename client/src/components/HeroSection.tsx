import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  const stats = [
    { number: "1000+", label: "Active Members" },
    { number: "50+", label: "Weekly Classes" },
    { number: "20+", label: "Expert Trainers" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-orange-500/80" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Transform Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Body
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in max-w-3xl mx-auto">
          Join FitHub and discover the perfect blend of cutting-edge equipment, 
          expert trainers, and motivating community
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <Button 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
            onClick={() => window.location.href = '/api/login'}
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 text-lg font-semibold hover:bg-white/30 transition-all duration-200"
          >
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 animate-fade-in">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
