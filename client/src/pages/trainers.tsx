import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrainerCard from "@/components/TrainerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star, Clock, User, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockTrainers } from "@/lib/mockData";

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionTime, setSessionTime] = useState("09:00");
  const [isBooking, setIsBooking] = useState(false);

  const { toast } = useToast();

  // Use mock data
  const trainers = mockTrainers;
  const isLoading = false;

  const handleBookTrainer = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedTrainer || !selectedDate) return;

    setIsBooking(true);

    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: "Success! Session Booked",
        description: `You've booked a session with ${selectedTrainer.name} on ${selectedDate.toDateString()} at ${sessionTime}.`,
        className: "bg-green-500 text-white border-0",
      });
      setShowBookingModal(false);
      setSessionNotes("");
      setSelectedDate(new Date());
    }, 1500);
  };

  const filteredTrainers = trainers?.filter((trainer: any) =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialties?.some((specialty: string) =>
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-muted/20 rounded-lg"></div>
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

      <main className="container mx-auto px-4 py-8 mt-16 space-y-10">
        {/* Header */}
        <div className="text-center md:text-left mb-8 md:flex justify-between items-end border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tighter">
              Expert <span className="text-primary text-glow">Trainers</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Certified professionals dedicated to helping you achieve your fitness goals
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 md:mt-0 relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search trainers or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl"
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
          <div className="text-center py-24 glass-panel rounded-xl border-dashed border-2 border-white/5">
            <div className="bg-muted/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No trainers found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-md bg-card border-primary/20 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">Book Session</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Schedule your one-on-one personal training session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {selectedTrainer && (
              <div className="flex items-center space-x-4 p-4 bg-muted/10 rounded-xl border border-white/5">
                <img
                  src={selectedTrainer.imageUrl || "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100&h=100&fit=crop&crop=face"}
                  alt={selectedTrainer.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/50"
                />
                <div>
                  <h3 className="font-bold text-lg">{selectedTrainer.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTrainer.specialties?.join(", ")}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="text-sm ml-1 font-mono font-bold">{selectedTrainer.rating}</span>
                    <span className="text-sm text-muted-foreground ml-3 border-l border-white/10 pl-3">
                      ${selectedTrainer.hourlyRate}/hr
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">Date</Label>
                <div className="p-3 border border-white/10 rounded-lg bg-black/20 text-sm">
                  {/* Simplified Date Picker for Demo */}
                  <input
                    type="date"
                    className="bg-transparent w-full focus:outline-none text-foreground color-scheme-dark"
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block text-muted-foreground">Time</Label>
                <select
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-full px-3 py-3 border border-white/10 rounded-lg bg-black/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time} className="bg-gray-900">
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block text-muted-foreground">Notes</Label>
              <Textarea
                placeholder="Goals, injuries, or focus areas..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
                className="bg-black/20 border-white/10 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30 resize-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5 hover:text-white"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                onClick={confirmBooking}
                disabled={!selectedDate || isBooking}
              >
                {isBooking ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
