"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";
import { H2 } from "@/components/typography/typography";
import { Container } from "../container";
import { toast } from "sonner";
import { useGetActiveTestimonials } from "@/api/testimonials.service";
import { Testimonial } from "@/supabase/schema/schema.type";

const TestimonialsSection = () => {
  const {
    data: testimonials = [],
    error: testimonials_error,
    isLoading,
  } = useGetActiveTestimonials();

  if (testimonials_error) toast.error("Error fetching testimonials");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show 3 testimonials at a time on desktop, 1 on mobile
  const itemsPerPage =
    typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  const handleNext = useCallback(() => {
    if (canGoNext && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [canGoNext, isAnimating]);

  const handlePrev = useCallback(() => {
    if (canGoPrev && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [canGoPrev, isAnimating]);

  const currentTestimonials = testimonials.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Container className="!px-0 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-7"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-6 h-64"
              ></div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!testimonials.length) {
    return null;
  }

  return (
    <Container className="!px-0 mt-16">
      {/* Header */}
      <div className="flex justify-between items-center">
        <H2>What Our Customers Say</H2>
        {totalPages > 1 && (
          <div className="flex gap-2 items-center">
            <button
              onClick={handlePrev}
              className={`bg-[#272727] p-2 rounded-full transition-opacity duration-200 ${
                !canGoPrev || isAnimating
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100 hover:opacity-80"
              }`}
              disabled={!canGoPrev || isAnimating}
            >
              <ChevronLeft color="#fff" size={24} />
            </button>
            <button
              onClick={handleNext}
              className={`bg-[#272727] p-2 rounded-full transition-opacity duration-200 ${
                !canGoNext || isAnimating
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100 hover:opacity-80"
              }`}
              disabled={!canGoNext || isAnimating}
            >
              <ChevronRight color="#fff" size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Testimonials Grid */}
      <div className="mt-7">
        <div className="relative overflow-hidden min-h-[300px]">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {currentTestimonials.map((testimonial: Testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="text-gray-300" size={32} />
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-4">
                  &ldquo;{testimonial.testimonial_text}&rdquo;
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-3">
                  {testimonial.client_image ? (
                    <Image
                      src={testimonial.client_image}
                      alt={testimonial.client_name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-lg">
                        {testimonial.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {testimonial.client_name}
                    </h4>
                    {testimonial.client_designation && (
                      <p className="text-xs text-gray-500">
                        {testimonial.client_designation}
                        {testimonial.company_name &&
                          `, ${testimonial.company_name}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Fill empty slots to maintain grid structure */}
            {Array.from({
              length: itemsPerPage - currentTestimonials.length,
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-full h-fit opacity-0 pointer-events-none"
              >
                {/* Invisible placeholder to maintain grid */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 300);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-[#272727] w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                disabled={isAnimating}
              />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default TestimonialsSection;
