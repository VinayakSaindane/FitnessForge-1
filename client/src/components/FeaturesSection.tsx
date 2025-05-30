import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Users, Calendar, Heart, Smartphone, Trophy } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "State-of-the-Art Equipment",
      description: "Premium fitness equipment from top brands, regularly maintained and updated to provide the best workout experience.",
    },
    {
      icon: Users,
      title: "Expert Trainers",
      description: "Certified professionals with years of experience to guide you on your fitness journey and help you achieve your goals safely.",
    },
    {
      icon: Calendar,
      title: "Flexible Classes",
      description: "Wide variety of classes scheduled throughout the day to fit your busy lifestyle. From HIIT to yoga, we have something for everyone.",
    },
    {
      icon: Heart,
      title: "Wellness Focus",
      description: "Holistic approach to fitness including nutrition guidance, recovery programs, and mental wellness support.",
    },
    {
      icon: Smartphone,
      title: "Smart Booking",
      description: "Easy online booking system with real-time availability, automated reminders, and seamless class management.",
    },
    {
      icon: Trophy,
      title: "Results Driven",
      description: "Track your progress with our advanced monitoring system and celebrate your achievements with our supportive community.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose FitHub?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our premium facilities, expert guidance, and supportive community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
