import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Medal, Users, Leaf, Target, Heart, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We focus on measurable outcomes and helping you achieve your specific fitness goals through proven methodologies."
    },
    {
      icon: Heart,
      title: "Community First",
      description: "Building a supportive environment where members motivate and inspire each other to reach new heights."
    },
    {
      icon: Leaf,
      title: "Holistic Wellness",
      description: "We believe in total wellness - combining physical fitness with mental well-being and nutritional guidance."
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Maintaining the highest standards in equipment, training, and member experience to deliver exceptional results."
    }
  ];

  const stats = [
    { number: "5+", label: "Years of Excellence" },
    { number: "1000+", label: "Active Members" },
    { number: "50+", label: "Weekly Classes" },
    { number: "20+", label: "Expert Trainers" },
  ];

  const timeline = [
    {
      year: "2018",
      title: "FitHub Founded",
      description: "Started with a vision to create an inclusive fitness community in the heart of the city."
    },
    {
      year: "2019",
      title: "Facility Expansion",
      description: "Doubled our space and added state-of-the-art equipment to serve our growing community."
    },
    {
      year: "2020",
      title: "Virtual Training Launch",
      description: "Pioneered online fitness classes during the pandemic, keeping our community connected."
    },
    {
      year: "2021",
      title: "Wellness Center Added",
      description: "Introduced nutrition counseling, massage therapy, and recovery services."
    },
    {
      year: "2022",
      title: "Award Recognition",
      description: "Named 'Best Gym in the City' by Fitness Magazine for outstanding member satisfaction."
    },
    {
      year: "2023",
      title: "Technology Integration",
      description: "Launched mobile app with booking system and progress tracking capabilities."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About FitHub
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Founded in 2018, FitHub has been dedicated to creating a welcoming, inclusive environment 
              where everyone can pursue their fitness goals. Our state-of-the-art facility combines 
              cutting-edge equipment with expert guidance to deliver results that last.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Medal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Award-Winning Facility</h3>
                  <p className="text-gray-600">
                    Recognized as the Best Gym in the city for three consecutive years by Fitness Magazine.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Community Focused</h3>
                  <p className="text-gray-600">
                    Building a supportive community where members motivate and inspire each other.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Holistic Approach</h3>
                  <p className="text-gray-600">
                    Total wellness combining physical fitness with mental well-being and nutrition.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/membership">
              <Button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-4 text-lg">
                Join Our Community
              </Button>
            </Link>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                alt="FitHub reception area" 
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=200&fit=crop" 
                alt="Premium locker facilities" 
                className="rounded-2xl shadow-lg w-full h-32 object-cover"
              />
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=200&fit=crop" 
                alt="Happy FitHub community" 
                className="rounded-2xl shadow-lg w-full h-32 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop" 
                alt="Wellness consultation area" 
                className="rounded-2xl shadow-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at FitHub
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones that shaped FitHub into the premier fitness destination it is today
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <Badge className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-2 text-lg font-bold">
                      {item.year}
                    </Badge>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center p-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            "To empower individuals to achieve their fitness goals through expert guidance, 
            state-of-the-art facilities, and a supportive community that celebrates every 
            victory on the journey to better health and wellness."
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
