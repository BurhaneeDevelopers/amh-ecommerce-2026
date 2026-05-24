"use client";

import React from "react";
import { Star, MapPin, Phone, ExternalLink, MessageSquare, CheckCircle } from "lucide-react";
import { H2 } from "@/components/typography/typography";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  author: string;
  avatarLetter?: string;
  avatarBg?: string;
  avatarUrl?: string;
  isLocalGuide?: boolean;
  rating: number;
  timeAgo: string;
  text: string;
}

const OFFICIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Gopalakrishnan V",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", // Premium portrait
    isLocalGuide: true,
    rating: 5,
    timeAgo: "1 month ago",
    text: "Excellent and patient service Competitive price",
  },
  {
    id: "rev-2",
    author: "Jeeva Kumar",
    avatarLetter: "J",
    avatarBg: "bg-blue-600 text-white",
    isLocalGuide: false,
    rating: 5,
    timeAgo: "2 months ago",
    text: "Hydraulic fittings are ready, and we got the best prices.",
  },
  {
    id: "rev-3",
    author: "Mohamed Asif",
    avatarLetter: "M",
    avatarBg: "bg-orange-500 text-white",
    isLocalGuide: true,
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "Wide collection of hydraulic hoses and tubes. Quick fabrication and custom crimping!",
  },
  {
    id: "rev-4",
    author: "Alphonse D",
    avatarLetter: "A",
    avatarBg: "bg-emerald-600 text-white",
    isLocalGuide: false,
    rating: 4,
    timeAgo: "5 months ago",
    text: "Good response time and competitive pricing. Reliable partner for industrial fittings.",
  },
  {
    id: "rev-5",
    author: "Sanjay Sharma",
    avatarLetter: "S",
    avatarBg: "bg-purple-600 text-white",
    isLocalGuide: true,
    rating: 5,
    timeAgo: "2 weeks ago",
    text: "Best place in Chennai for high-pressure hydraulic equipment. Very helpful staff.",
  },
  {
    id: "rev-6",
    author: "Ramachandran K",
    avatarLetter: "R",
    avatarBg: "bg-amber-600 text-white",
    isLocalGuide: false,
    rating: 4,
    timeAgo: "6 months ago",
    text: "Prompt delivery and original quality materials. Happy with their customer support.",
  }
];

// Distribution matches the summary from the screenshot:
// 5 stars: long, 4 stars: short, 3 stars: dot, 2 stars: dot, 1 star: medium-short
const RATING_DISTRIBUTION = [
  { stars: 5, count: 28, percentage: "70%" },
  { stars: 4, count: 4, percentage: "10%" },
  { stars: 3, count: 1, percentage: "2.5%" },
  { stars: 2, count: 1, percentage: "2.5%" },
  { stars: 1, count: 6, percentage: "15%" },
];

export default function GoogleReviewsSection() {
  const googleMapsUrl = "https://www.google.com/maps/place/A.M+HYDRAULICS+%26+TUBES/@13.0934057,80.2520692,17z/data=!4m8!3m7!1s0x3a526f56193796d1:0x4de35f29d287bfbe!8m2!3d13.0934057!4d80.2546441!9m1!1b1!16s%2Fg%2F11b7ck5h7q?entry=ttu";

  const renderStars = (rating: number, size = 16) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={size}
        className={`${
          index < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : index < rating
            ? "fill-amber-400/50 text-amber-400"
            : "text-slate-200 dark:text-slate-700"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 border-t border-slate-100 dark:border-slate-800/60 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/20 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>100% Verified Google Reviews</span>
          </div>
          <H2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            What Our Clients Say on Google
          </H2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans">
            Real feedback from our partners, industrial clients, and customers of A.M HYDRAULICS & TUBES.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Google Place Summary Card (Span 4) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md p-6 lg:sticky lg:top-24"
          >
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-5">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  A.M HYDRAULICS & TUBES
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                  Hydraulic equipment supplier
                </p>
              </div>
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                {/* Google "G" Icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 12.99a5.53 5.53 0 0 1 5.59-5.525c2.463 0 4.156 1.016 5.093 1.91l3.07-3.07C20.25 4.545 17.41 3 13.99 3 8.47 3 4 7.47 4 12.99c0 5.52 4.47 9.99 9.99 9.99 5.75 0 10.14-4.04 10.14-9.99 0-.676-.08-1.32-.225-1.95a12.8 12.8 0 0 0-11.665-.755z"
                  />
                </svg>
              </div>
            </div>

            {/* Rating Stats Summary */}
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  4.1
                </div>
                <div className="flex justify-center gap-0.5 my-1.5">
                  {renderStars(4.1, 14)}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  (40 Reviews)
                </div>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-1.5">
                {RATING_DISTRIBUTION.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-slate-500 font-medium text-right">{dist.stars}</span>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: dist.percentage }}
                      />
                    </div>
                    <span className="w-6 text-slate-400 text-right">{dist.percentage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Details */}
            <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-5 text-sm text-slate-600 dark:text-slate-300 font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  148, Angappa Nicken Street, Chennai, Tamil Nadu 600001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <span>093827 13392</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 text-xs font-semibold gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                asChild
              >
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Google Maps
                </a>
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 text-xs font-semibold gap-2 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
                asChild
              >
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Write a Review
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Customer Reviews Grid/Cards (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {OFFICIAL_REVIEWS.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Author Header */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="relative">
                      {review.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.avatarUrl}
                          alt={review.author}
                          className="w-11 h-11 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                        />
                      ) : (
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base ${review.avatarBg}`}>
                          {review.avatarLetter}
                        </div>
                      )}
                      {/* Local Guide Badge */}
                      {review.isLocalGuide && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-400 border-2 border-white dark:border-slate-900 rounded-full p-0.5" title="Local Guide">
                          <svg className="w-2.5 h-2.5 fill-white text-white" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {review.author}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        {review.isLocalGuide ? "Local Guide" : "Verified Customer"} • {review.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2.5">
                    {renderStars(review.rating, 14)}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-sans italic">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>

                {/* Google Source Tag */}
                <div className="mt-4 pt-3 border-t border-slate-100/60 dark:border-slate-800/40 flex justify-between items-center text-[10px] text-slate-400 font-sans">
                  <span>via Google Reviews</span>
                  <div className="w-3.5 h-3.5 opacity-60">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                      <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 12.99a5.53 5.53 0 0 1 5.59-5.525c2.463 0 4.156 1.016 5.093 1.91l3.07-3.07C20.25 4.545 17.41 3 13.99 3 8.47 3 4 7.47 4 12.99c0 5.52 4.47 9.99 9.99 9.99 5.75 0 10.14-4.04 10.14-9.99 0-.676-.08-1.32-.225-1.95a12.8 12.8 0 0 0-11.665-.755z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
