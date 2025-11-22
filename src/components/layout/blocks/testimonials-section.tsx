"use client";

import { Star, Quote } from "lucide-react";
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
      <div className="flex justify-between items-center mb-7">
        <H2>What Our Customers Say</H2>
      </div>

      {/* Testimonials - Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 sm:gap-6 overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial: Testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-[320px] w-[360px] md:w-auto snap-start flex-shrink-0"
          >
            {/* Quote Icon */}
            <div className="flex justify-between items-start mb-4">
              <Quote className="text-gray-300" size={32} />
              <div className="flex gap-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>

            {/* Testimonial Text */}
            <div className="flex-grow">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-5">
                &ldquo;{testimonial.testimonial_text}&rdquo;
              </p>
            </div>

            {/* Client Info - Always at bottom */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
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
      </div>
    </Container>
  );
};

export default TestimonialsSection;
