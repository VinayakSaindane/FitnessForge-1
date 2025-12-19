import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />

      {/* Quick Preview Section */}
      <section className="py-20 bg-background relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
              Why Choose <span className="text-primary">FitnessForge?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium facilities and expert guidance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-panel border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/50">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Expert Trainers</h3>
                <p className="text-muted-foreground">Certified professionals with years of experience dedicated to your success</p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/50">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Flexible Classes</h3>
                <p className="text-muted-foreground">Wide variety of classes scheduled throughout the day to fit your busy lifestyle</p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/50">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">24/7 Access</h3>
                <p className="text-muted-foreground">Train on your schedule with round-the-clock access to our state-of-the-art facilities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
            Ready to <span className="text-primary text-glow">Transform</span> Your Life?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto">
            Join thousands of members who have already started their fitness journey with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/membership">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 px-10 py-6 text-lg font-semibold backdrop-blur-sm"
              >
                Learn More
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm md:text-base text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No Long-Term Contracts</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
