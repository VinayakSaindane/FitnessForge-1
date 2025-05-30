import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrainerCard from "@/components/TrainerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionTime, setSessionTime] = useState("09:00");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trainers, isLoading } = useQuery({
    queryKey: ["/api/trainers"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest("POST", "/api/personal-training", sessionData);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Personal training session booked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-personal-training"] });
      setShowBookingModal(false);
      setSessionNotes("");
      setSelectedDate(new Date());
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book session",
        variant: "destructive",
      });
    },
  });

  const filteredTrainers = trainers?.filter((trainer: any) => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialties?.some((specialty: string) => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleBookTrainer = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedTrainer || !selectedDate) return;

    const sessionDateTime = new Date(selectedDate);
    const [hours, minutes] = sessionTime.split(':');
    sessionDateTime.setHours(parseInt(hours), parseInt(minutes));

    bookingMutation.mutate({
      trainerId: selectedTrainer.id,
      sessionDate: sessionDateTime.toISOString(),
      duration: 60,
      notes: sessionNotes,
      price: selectedTrainer.hourlyRate,
    });
  };

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
            Expert Trainers
          </h1>
          <p className="text-xl text-gray-600">
            Certified professionals dedicated to helping you achieve your fitness goals
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search trainers or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTrainers?.map((trainer: any) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onBook={() => handleBookTrainer(trainer)}
            />
          ))}
        </div>

        {filteredTrainers?.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Personal Training Session</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedTrainer && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedTrainer.imageUrl || "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100&h=100&fit=crop&crop=face"}
                  alt={selectedTrainer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{selectedTrainer.name}</h3>
                  <p className="text-sm text-gray-600">{selectedTrainer.specialties?.join(", ")}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm ml-1">{selectedTrainer.rating}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      ${selectedTrainer.hourlyRate}/hour
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-base font-medium mb-3 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Preferred Time</Label>
              <select
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">Session Notes (Optional)</Label>
              <Textarea
                placeholder="Let your trainer know about your goals, any injuries, or specific areas you'd like to focus on..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={confirmBooking}
                disabled={!selectedDate || bookingMutation.isPending}
              >
                {bookingMutation.isPending ? "Booking..." : "Book Session"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
