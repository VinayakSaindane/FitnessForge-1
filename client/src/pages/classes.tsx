import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockClassesList, mockSchedulesList } from "@/lib/mockData";

export default function Classes() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIntensity, setSelectedIntensity] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use mock data
  const classes = mockClassesList;
  const schedules = mockSchedulesList;
  const classesLoading = false;

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      // Simulate API call
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Success! 🎉",
        description: "Class booked successfully! Get ready to sweat.",
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
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  if (classesLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16 space-y-8">
        {/* Header */}
        <div className="mb-8 relative overflow-hidden rounded-2xl glass-panel p-8">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Fitness Classes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Find the perfect workout for your fitness level and goals. From high-intensity HIIT to calming Yoga.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <Sparkles size={200} className="text-primary" />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4 glass-panel p-6 rounded-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search classes, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-input focus:ring-primary"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-8">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Class Type</p>
              <div className="flex flex-wrap gap-2">
                {classTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={`capitalize ${selectedType === type ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20 hover:text-primary border-primary/20'}`}
                  >
                    {type === "all" ? "All Classes" : type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Intensity</p>
              <div className="flex flex-wrap gap-2">
                {intensities.map((intensity) => (
                  <Button
                    key={intensity}
                    variant={selectedIntensity === intensity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIntensity(intensity)}
                    className={`capitalize ${selectedIntensity === intensity ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20 hover:text-primary border-primary/20'}`}
                  >
                    {intensity === "all" ? "All Levels" : intensity}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {filteredClasses?.map((cls: any) => {
            const classSchedules = schedules?.filter((s: any) => s.classId === cls.id) || [];

            return (
              <div key={cls.id} className="transition-transform hover:-translate-y-2 duration-300">
                <ClassCard
                  classData={cls}
                  schedules={classSchedules}
                  onBook={handleBookClass}
                  formatTime={formatTime}
                  getDayName={getDayName}
                  getIntensityColor={getIntensityColor}
                />
              </div>
            );
          })}
        </div>

        {filteredClasses?.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-xl">
            <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No classes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            <Button
              variant="link"
              className="text-primary mt-4"
              onClick={() => { setSearchTerm(''); setSelectedType('all'); setSelectedIntensity('all'); }}
            >
              Clear all filters
            </Button>
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
