import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Calendar, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      
      {/* Quick Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose FitHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium facilities and expert guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Expert Trainers</h3>
                <p className="text-gray-600">Certified professionals with years of experience</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Flexible Classes</h3>
                <p className="text-gray-600">Wide variety of classes scheduled throughout the day</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">24/7 Access</h3>
                <p className="text-gray-600">Train on your schedule with round-the-clock access</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of members who have already started their fitness journey with us
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span>No Long-Term Contracts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
