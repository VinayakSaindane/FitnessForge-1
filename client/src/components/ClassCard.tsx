import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";

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
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative">
        <img
          src={classData.imageUrl || getClassImage(classData.type)}
          alt={classData.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className={getIntensityColor(classData.intensity)}>
            {classData.intensity} intensity
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-gray-900">
            {classData.duration} min
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {classData.name}
        </h3>
        <p className="text-gray-600 mb-4">
          {classData.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {classData.instructor?.name || "Instructor"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {classData.duration} min
            </span>
          </div>
        </div>

        {/* Class Schedule */}
        {schedules.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule:</h4>
            <div className="space-y-1">
              {schedules.slice(0, 2).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {getDayName(schedule.dayOfWeek)}
                  </span>
                  <span className="font-medium">
                    {formatTime(schedule.startTime)}
                  </span>
                </div>
              ))}
              {schedules.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{schedules.length - 2} more times
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:shadow-lg transition-all duration-200"
          onClick={() => onBook(classData, schedules[0])}
          disabled={schedules.length === 0}
        >
          {schedules.length === 0 ? "No Schedule Available" : "Book Class"}
        </Button>
      </CardContent>
    </Card>
  );
}
