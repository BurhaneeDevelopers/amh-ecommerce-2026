"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { H2 } from "@/components/typography/typography";
import { Container } from "../container";
import { toast } from "sonner";
import { useGetActiveTestimonials } from "@/api/testimonials.service";
import { Testimonial } from "@/supabase/schema/schema.type";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TestimonialsSection = () => {
  const {
    data: testimonials = [],
    error: testimonials_error,
    isLoading,
  } = useGetActiveTestimonials();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);

  if (testimonials_error) toast.error("Error fetching testimonials");

  // Auto-slide functionality
  useEffect(() => {
    if (!testimonials.length || isHovered) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length, isHovered]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, [testimonials.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Container className="!px-0 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-7"></div>
          <div className="h-[400px] bg-gray-100 rounded-lg"></div>
        </div>
      </Container>
    );
  }

  if (!testimonials.length) {
    return null;
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <Container className="!px-0 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <H2>What Our Customers Say</H2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            className="h-9 w-9"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="h-9 w-9"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-8 md:p-10 hover:shadow-lg transition-shadow duration-300 mx-auto max-w-4xl">
              {/* Quote Icon and Stars */}
              <div className="flex justify-between items-start mb-6">
                <Quote className="text-gray-300" size={48} />
                <div className="flex gap-1">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>

              {/* Testimonial Text */}
              <div className="mb-8">
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center">
                  &ldquo;{testimonials[currentIndex].testimonial_text}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                {testimonials[currentIndex].client_image ? (
                  <Image
                    width={500}
                    height={500}
                    src={testimonials[currentIndex].client_image}
                    alt={testimonials[currentIndex].client_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-medium text-2xl">
                      {testimonials[currentIndex].client_name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h4 className="font-semibold text-gray-900 text-base">
                    {testimonials[currentIndex].client_name}
                  </h4>
                  {testimonials[currentIndex].client_designation && (
                    <p className="text-sm text-gray-500">
                      {testimonials[currentIndex].client_designation}
                      {testimonials[currentIndex].company_name &&
                        `, ${testimonials[currentIndex].company_name}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TestimonialsSection;
