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
    <Card className="overflow-hidden glass-panel border-white/5 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60" />
        <img
          src={trainer.imageUrl || getTrainerImage(trainer.name)}
          alt={trainer.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-white text-xl font-bold">{trainer.name}</h3>
          <p className="text-primary text-sm font-medium">
            {trainer.specialties?.[0] || "Fitness Specialist"}
          </p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(parseFloat(trainer.rating || "5"))
                    ? "text-primary fill-current"
                    : "text-muted-foreground/30"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm font-mono text-muted-foreground">
            ({trainer.rating || "5.0"})
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
          {trainer.bio || `${trainer.experience || "5+"} years experience in ${trainer.specialties?.[0] || "fitness training"}. Certified professional specializing in ${trainer.specialties?.slice(0, 2).join(" and ") || "strength building"}.`}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {trainer.specialties?.slice(0, 2).map((specialty: string, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-xs px-2 py-1"
            >
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          {trainer.hourlyRate && (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase">Rate</span>
              <span className="text-lg font-bold text-foreground">
                ${trainer.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span>
              </span>
            </div>
          )}

          <Button
            onClick={onBook}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20"
          >
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
