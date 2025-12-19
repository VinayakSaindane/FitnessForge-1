import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Shield, Calendar, Clock, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Membership() {
  const membershipPlans = [
    {
      name: "Basic",
      price: 49,
      description: "Perfect for getting started with your fitness journey",
      features: [
        { name: "Access to gym equipment", included: true },
        { name: "Basic locker room access", included: true },
        { name: "Mobile app access", included: true },
        { name: "Group classes", included: false },
        { name: "Personal training sessions", included: false },
        { name: "Nutrition consultation", included: false },
        { name: "Guest passes", included: false },
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: 89,
      description: "Everything you need for a complete fitness experience",
      features: [
        { name: "Access to gym equipment", included: true },
        { name: "Premium locker room with sauna", included: true },
        { name: "All group classes included", included: true },
        { name: "2 personal training sessions/month", included: true },
        { name: "Nutrition consultation", included: true },
        { name: "Guest passes (2/month)", included: true },
        { name: "24/7 gym access", included: false },
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: 149,
      description: "Ultimate fitness experience with VIP treatment",
      features: [
        { name: "24/7 gym access", included: true },
        { name: "VIP locker room & amenities", included: true },
        { name: "Unlimited group classes", included: true },
        { name: "4 personal training sessions/month", included: true },
        { name: "Monthly body composition analysis", included: true },
        { name: "Unlimited guest passes", included: true },
        { name: "Priority booking", included: true },
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes, you can cancel your membership at any time with 30 days notice. We offer a 30-day money-back guarantee for new members.",
    },
    {
      question: "Are there any setup fees?",
      answer: "No, we don't charge any setup fees or enrollment fees. The price you see is what you pay.",
    },
    {
      question: "Can I freeze my membership?",
      answer: "Yes, you can freeze your membership for up to 3 months per year for medical reasons or extended travel.",
    },
    {
      question: "Do you offer family discounts?",
      answer: "Yes, we offer a 15% discount for families with 3 or more members. Contact us for more details.",
    },
    {
      question: "What's included in personal training?",
      answer: "Personal training includes one-on-one sessions with certified trainers, customized workout plans, and progress tracking.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-16 space-y-16">
        {/* Header */}
        <div className="text-center mb-16 relative overflow-hidden rounded-3xl p-10 glass-panel">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              Choose Your <span className="text-primary text-glow">Membership</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible plans designed to fit your lifestyle and budget. No hidden fees.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
            <Sparkles size={200} className="text-primary" />
          </div>
        </div>

        {/* Membership Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {membershipPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative glass-panel border-white/5 transition-all duration-300 hover:-translate-y-2
                ${plan.popular ? 'border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/50' : 'hover:border-primary/30'}
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-primary text-primary-foreground px-6 py-1.5 font-bold shadow-lg animate-pulse-slow">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 border-b border-white/5">
                <CardTitle className="text-3xl font-bold mb-2 text-foreground">{plan.name}</CardTitle>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-black text-primary">${plan.price}</span>
                  <span className="text-muted-foreground ml-2 self-end mb-2">/month</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <div className="mr-3 bg-primary/20 rounded-full p-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/30 mr-3" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/50 line-through decoration-white/20"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/subscribe">
                  <Button
                    className={`w-full py-6 font-bold text-lg transition-all duration-300 ${plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/20'
                      : plan.name === 'Elite'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">
            Why Choose <span className="text-primary">FitnessForge</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center glass-panel border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">30-Day Guarantee</h3>
                <p className="text-muted-foreground">
                  Not satisfied? Get your money back within the first 30 days, no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center glass-panel border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">No Contracts</h3>
                <p className="text-muted-foreground">
                  Month-to-month membership with no long-term commitments. Cancel anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center glass-panel border-white/5 hover:border-primary/30 transition-colors">
              <CardContent className="p-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-foreground">Flexible Access</h3>
                <p className="text-muted-foreground">
                  Train on your schedule with extended hours and 24/7 access for premium members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl border border-white/5">
          <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold mb-2 text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 p-12 bg-primary/10 rounded-3xl border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white relative z-10">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground relative z-10">
            Join thousands of members who have transformed their lives at FitnessForge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/subscribe">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold shadow-xl">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
