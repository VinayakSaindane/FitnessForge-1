import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Shield } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to FitHub Premium! Your membership is now active.",
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Complete Your Subscription</CardTitle>
        <p className="text-gray-600">Secure payment powered by Stripe</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 text-lg"
            disabled={!stripe || !elements}
          >
            Subscribe Now
          </Button>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Subscribe() {
  // If Stripe is not configured, show alternative subscription page
  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join FitHub Premium
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock unlimited access to classes, personal training, and premium amenities
            </p>
          </div>

          {/* Benefits Summary */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Unlimited Classes</h3>
                  <p className="text-sm text-gray-600">Access to all group fitness classes</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Personal Training</h3>
                  <p className="text-sm text-gray-600">Monthly one-on-one sessions included</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Premium Amenities</h3>
                  <p className="text-sm text-gray-600">Sauna, spa, and VIP locker access</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact for Membership */}
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Crown className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Premium Membership</h3>
              <p className="text-gray-600 mb-6">
                Contact us to set up your premium membership and start your fitness journey today.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white py-3 text-lg mb-4"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
              <p className="text-sm text-gray-500">
                Call us at (555) 123-4567 or visit our contact page
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/get-or-create-subscription")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating subscription:", error);
      });
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Setting up your subscription...</p>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join FitHub Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock unlimited access to classes, personal training, and premium amenities
          </p>
        </div>

        {/* Benefits Summary */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Unlimited Classes</h3>
                <p className="text-sm text-gray-600">Access to all group fitness classes</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Personal Training</h3>
                <p className="text-sm text-gray-600">Monthly one-on-one sessions included</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Premium Amenities</h3>
                <p className="text-sm text-gray-600">Sauna, spa, and VIP locker access</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Form */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <SubscribeForm />
        </Elements>
      </main>

      <Footer />
    </div>
  );
}
