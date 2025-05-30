import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Activity, Trophy, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
  const { data: myBookings } = useQuery({
    queryKey: ["/api/my-bookings"],
  });

  const { data: personalTraining } = useQuery({
    queryKey: ["/api/my-personal-training"],
  });

  const { data: upcomingClasses } = useQuery({
    queryKey: ["/api/class-schedules"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Member'}!
          </h1>
          <p className="text-gray-600">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myBookings?.filter((b: any) => b.status === 'confirmed').length || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Personal Training</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {personalTraining?.filter((s: any) => s.status === 'scheduled').length || 0}
                  </p>
                </div>
                <User className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Membership</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.membershipType?.charAt(0).toUpperCase() + user?.membershipType?.slice(1) || 'Basic'}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.membershipStatus === 'active' ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Upcoming Classes</span>
                <Link href="/classes">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBookings?.slice(0, 5).map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{booking.class?.name}</h4>
                      <p className="text-sm text-gray-600">
                        with {booking.class?.instructor?.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {getDayName(booking.schedule?.dayOfWeek)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(booking.schedule?.startTime)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming classes</p>
                    <Link href="/classes">
                      <Button className="mt-4">Book Your First Class</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Classes Today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Available Classes Today</span>
                <Link href="/classes">
                  <Button variant="outline" size="sm">Browse All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses?.slice(0, 5).map((schedule: any) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{schedule.class?.name}</h4>
                      <p className="text-sm text-gray-600">
                        with {schedule.class?.instructor?.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {schedule.class?.intensity} intensity
                        </Badge>
                      </div>
                    </div>
                    <Link href="/classes">
                      <Button size="sm">Book</Button>
                    </Link>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No classes available today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/classes">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">Book a Class</h3>
                <p className="text-gray-600">Browse and book from our variety of fitness classes</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/trainers">
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-lg font-semibold mb-2">Personal Training</h3>
                <p className="text-gray-600">Schedule one-on-one sessions with our expert trainers</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/membership">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-lg font-semibold mb-2">Upgrade Membership</h3>
                <p className="text-gray-600">Unlock premium features and exclusive benefits</p>
              </CardContent>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
