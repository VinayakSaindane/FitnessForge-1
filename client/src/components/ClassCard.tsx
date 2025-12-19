import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface ClassCardProps {
  classData: any;
  schedules: any[];
  onBook: (classData: any, schedule: any) => void;
  formatTime: (time: string) => string;
  getDayName: (day: number) => string;
  getIntensityColor: (intensity: string) => string;
}

export default function ClassCard({
  classData,
  schedules,
  onBook,
  formatTime,
  getDayName,
  getIntensityColor
}: ClassCardProps) {
  const getClassImage = (type: string) => {
    const images: { [key: string]: string } = {
      hiit: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
      yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=300&fit=crop",
      strength: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=300&fit=crop",
      cardio: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
      pilates: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=300&fit=crop",
      boxing: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=300&fit=crop",
    };
    return images[type] || images.hiit;
  };

  return (
    <Card className="overflow-hidden glass-panel border-white/5 hover:border-primary/50 text-foreground">
      <div className="relative group">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
        <img
          src={classData.imageUrl || getClassImage(classData.type)}
          alt={classData.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <Badge className={getIntensityColor(classData.intensity) + " backdrop-blur-md"}>
            {classData.intensity} intensity
          </Badge>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/10">
            {classData.duration} min
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 relative">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {classData.name}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {classData.description}
        </p>

        <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/5">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">
              {classData.instructor?.name || "Instructor"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">
              {classData.duration} min
            </span>
          </div>
        </div>

        {/* Class Schedule */}
        {schedules.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-black/20 border border-white/5">
            <h4 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Next Sessions:</h4>
            <div className="space-y-2">
              {schedules.slice(0, 2).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    {getDayName(schedule.dayOfWeek)}
                  </span>
                  <span className="font-mono text-foreground">
                    {formatTime(schedule.startTime)}
                  </span>
                </div>
              ))}
              {schedules.length > 2 && (
                <div className="text-xs text-muted-foreground text-center mt-2">
                  +{schedules.length - 2} more times
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 font-bold shadow-lg shadow-primary/20"
          onClick={() => onBook(classData, schedules[0])}
          disabled={schedules.length === 0}
        >
          {schedules.length === 0 ? "No Schedule Available" : "Book Class"}
        </Button>
      </CardContent>
    </Card>
  );
}
