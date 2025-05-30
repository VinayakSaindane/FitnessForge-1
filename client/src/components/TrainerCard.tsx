import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface TrainerCardProps {
  trainer: any;
  onBook: () => void;
}

export default function TrainerCard({ trainer, onBook }: TrainerCardProps) {
  const getTrainerImage = (name: string) => {
    // Use a placeholder service or default images based on trainer
    const defaultImages = [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face",
    ];
    
    // Simple hash to consistently assign image based on trainer name
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return defaultImages[Math.abs(hash) % defaultImages.length];
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={trainer.imageUrl || getTrainerImage(trainer.name)}
          alt={trainer.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{trainer.name}</h3>
          <p className="text-white/90 text-sm">
            {trainer.specialties?.[0] || "Fitness Specialist"}
          </p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(parseFloat(trainer.rating || "5"))
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            ({trainer.rating || "5.0"})
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {trainer.bio || `${trainer.experience || "5+"} years experience in ${trainer.specialties?.[0] || "fitness training"}. Certified professional specializing in ${trainer.specialties?.slice(0, 2).join(" and ") || "strength building"}.`}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {trainer.specialties?.slice(0, 2).map((specialty: string, index: number) => (
            <Badge 
              key={index}
              variant="secondary"
              className="bg-orange-100 text-orange-700 text-xs"
            >
              {specialty}
            </Badge>
          ))}
        </div>
        
        {trainer.hourlyRate && (
          <p className="text-sm text-gray-500 mb-4">
            ${trainer.hourlyRate}/hour
          </p>
        )}
        
        <Button
          onClick={onBook}
          className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:shadow-lg transition-all duration-200"
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
}
