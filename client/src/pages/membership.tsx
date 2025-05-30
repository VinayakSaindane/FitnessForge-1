import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Shield, Calendar, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Membership
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Flexible plans designed to fit your lifestyle and budget
          </p>
        </div>

        {/* Membership Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {membershipPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'hover:shadow-lg'} transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-2">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/subscribe">
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-orange-500 hover:shadow-lg' 
                      : plan.name === 'Elite' 
                        ? 'bg-gray-900 hover:bg-gray-800' 
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                    size="lg"
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
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose FitHub Membership?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="w-16 h-16 mx-auto mb-6 text-blue-500" />
                <h3 className="text-xl font-bold mb-4">30-Day Guarantee</h3>
                <p className="text-gray-600">
                  Not satisfied? Get your money back within the first 30 days, no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Calendar className="w-16 h-16 mx-auto mb-6 text-orange-500" />
                <h3 className="text-xl font-bold mb-4">No Contracts</h3>
                <p className="text-gray-600">
                  Month-to-month membership with no long-term commitments. Cancel anytime.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Clock className="w-16 h-16 mx-auto mb-6 text-purple-500" />
                <h3 className="text-xl font-bold mb-4">Flexible Access</h3>
                <p className="text-gray-600">
                  Train on your schedule with extended hours and 24/7 access for premium members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 p-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of members who have transformed their lives at FitHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
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
