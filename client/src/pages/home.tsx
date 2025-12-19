import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Activity, Trophy, Star, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { mockBookings, mockPersonalTraining, mockUpcomingClasses } from "@/lib/mockData";

export default function Home() {
  const { user } = useAuth();

  // Use mock data directly
  const myBookings = mockBookings;
  const personalTraining = mockPersonalTraining;
  const upcomingClasses = mockUpcomingClasses;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16 space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl glass-panel p-8 mb-8">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
              Welcome back, <span className="text-primary">{user?.firstName || 'Member'}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to crush your fitness goals today?
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <Sparkles size={200} className="text-primary" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="glass-panel border-white/5 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                  <p className="text-3xl font-bold text-foreground">
                    {myBookings?.filter((b: any) => b.status === 'confirmed').length || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Personal Training</p>
                  <p className="text-3xl font-bold text-foreground">
                    {personalTraining?.filter((s: any) => s.status === 'scheduled').length || 0}
                  </p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membership</p>
                  <p className="text-xl font-bold text-foreground">
                    {user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1) || 'Basic'}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/5 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-xl font-bold text-foreground">
                    {user?.membershipStatus === 'active' ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* My Bookings */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span>My Upcoming Classes</span>
                <Link href="/classes">
                  <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBookings?.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{booking.class?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        with {booking.class?.instructor?.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1 text-primary" />
                          {getDayName(booking.schedule?.dayOfWeek)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1 text-primary" />
                          {formatTime(booking.schedule?.startTime)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status) + " border"}>
                      {booking.status}
                    </Badge>
                  </div>
                )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming classes</p>
                      <Link href="/classes">
                        <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">Book Your First Class</Button>
                      </Link>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Available Classes Today */}
          <Card className="glass-panel border-white/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span>Available Classes Today</span>
                <Link href="/classes">
                  <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">Browse All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses?.slice(0, 5).map((schedule: any) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{schedule.class?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        with {schedule.class?.instructor?.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1 text-primary" />
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {schedule.class?.intensity} intensity
                        </Badge>
                      </div>
                    </div>
                    <Link href="/classes">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Book</Button>
                    </Link>
                  </div>
                )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No classes available today</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Card className="group glass-panel border-white/5 hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1">
            <Link href="/classes">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Book a Class</h3>
                <p className="text-muted-foreground">Browse and book from our variety of fitness classes</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="group glass-panel border-white/5 hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1">
            <Link href="/trainers">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Personal Training</h3>
                <p className="text-muted-foreground">Schedule one-on-one sessions with our expert trainers</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="group glass-panel border-white/5 hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1">
            <Link href="/membership">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Upgrade Membership</h3>
                <p className="text-muted-foreground">Unlock premium features and exclusive benefits</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
