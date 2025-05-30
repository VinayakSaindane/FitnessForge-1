import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function TestimonialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: testimonials } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  // Default testimonials if none are loaded
  const defaultTestimonials = [
    {
      id: 1,
      content: "FitHub has completely transformed my approach to fitness. The trainers are incredible, the facilities are top-notch, and the community is so supportive. I've never felt stronger or more confident!",
      rating: 5,
      user: { firstName: "Jessica", lastName: "M." },
      membershipInfo: "Premium Member since 2022"
    },
    {
      id: 2,
      content: "The personal training program here is exceptional. My trainer helped me lose 30 pounds and build the strength I never thought I could achieve. The investment in my health was worth every penny.",
      rating: 5,
      user: { firstName: "David", lastName: "R." },
      membershipInfo: "Elite Member since 2021"
    },
    {
      id: 3,
      content: "I love the variety of classes offered here! From yoga to HIIT, there's something for every mood and fitness level. The instructors are knowledgeable and always push you to be your best.",
      rating: 5,
      user: { firstName: "Maria", lastName: "S." },
      membershipInfo: "Premium Member since 2023"
    }
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getAvatarImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face"
    ];
    return images[index % images.length];
  };

  if (!displayTestimonials || displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who transformed their lives at FitHub
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="relative h-96 md:h-80">
                <div 
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {displayTestimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 p-8 md:p-12 text-center flex flex-col justify-center">
                      <div className="flex justify-center mb-6">
                        <img
                          src={getAvatarImage(index)}
                          alt="Member testimonial"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                      <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed italic">
                        "{testimonial.content}"
                      </blockquote>
                      <div className="flex justify-center mb-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-5 h-5 ${
                                i < (testimonial.rating || 5)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-900 font-semibold">
                        {testimonial.user?.firstName} {testimonial.user?.lastName}
                      </div>
                      <div className="text-gray-600">
                        {testimonial.membershipInfo || "FitHub Member"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
