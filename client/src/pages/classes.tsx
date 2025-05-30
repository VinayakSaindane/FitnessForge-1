import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Classes() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["/api/classes"],
  });

  const { data: schedules } = useQuery({
    queryKey: ["/api/class-schedules"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest("POST", "/api/book-class", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Class booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-bookings"] });
      setShowBookingModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book class",
        variant: "destructive",
      });
    },
  });

  const classTypes = ["all", "hiit", "yoga", "strength", "cardio", "pilates", "boxing"];
  const intensities = ["all", "low", "medium", "high"];

  const filteredClasses = classes?.filter((cls: any) => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || cls.type === selectedType;
    const matchesIntensity = selectedIntensity === "all" || cls.intensity === selectedIntensity;
    
    return matchesSearch && matchesType && matchesIntensity;
  });

  const handleBookClass = (cls: any, schedule: any) => {
    setSelectedClass(cls);
    setSelectedSchedule(schedule);
    setShowBookingModal(true);
  };

  const confirmBooking = (bookingDate: Date) => {
    if (!selectedClass || !selectedSchedule) return;

    bookingMutation.mutate({
      classId: selectedClass.id,
      scheduleId: selectedSchedule.id,
      bookingDate: bookingDate.toISOString(),
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (classesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fitness Classes
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect workout for your fitness level and goals
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search classes, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Class Type</p>
              <div className="flex flex-wrap gap-2">
                {classTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="capitalize"
                  >
                    {type === "all" ? "All Classes" : type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Intensity</p>
              <div className="flex flex-wrap gap-2">
                {intensities.map((intensity) => (
                  <Button
                    key={intensity}
                    variant={selectedIntensity === intensity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIntensity(intensity)}
                    className="capitalize"
                  >
                    {intensity === "all" ? "All Levels" : intensity}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses?.map((cls: any) => {
            const classSchedules = schedules?.filter((s: any) => s.classId === cls.id) || [];
            
            return (
              <ClassCard
                key={cls.id}
                classData={cls}
                schedules={classSchedules}
                onBook={handleBookClass}
                formatTime={formatTime}
                getDayName={getDayName}
                getIntensityColor={getIntensityColor}
              />
            );
          })}
        </div>

        {filteredClasses?.length === 0 && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedClass={selectedClass}
        selectedSchedule={selectedSchedule}
        onConfirm={confirmBooking}
        isLoading={bookingMutation.isPending}
        formatTime={formatTime}
        getDayName={getDayName}
      />

      <Footer />
    </div>
  );
}
