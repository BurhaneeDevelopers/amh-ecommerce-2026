'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdsByPlacement } from '@/api/ads.service';

// Fallback images if no ads are available
const fallbackImages = [
  '/banners/cordless-tool.jpg',
  '/banners/tool-box.jpg',
];

const swipeConfidenceThreshold = 5000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

const BannerSlider: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch banner ads
  const { data: bannerAds = [] } = useGetAdsByPlacement('banner_slider');
  
  // Use ads if available, otherwise fallback to static images
  const slides = bannerAds.length > 0 
    ? bannerAds.map(ad => ({ 
        src: ad.media_url, 
        alt: ad.title, 
        clickUrl: ad.click_url,
        title: ad.title,
        description: ad.description 
      }))
    : fallbackImages.map((img, idx) => ({ 
        src: img, 
        alt: `Banner ${idx + 1}`, 
        clickUrl: null,
        title: null,
        description: null 
      }));

  const paginate = useCallback((direction: number) => {
    setIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return slides.length - 1;
      if (newIndex >= slides.length) return 0;
      return newIndex;
    });
  }, [slides.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setIndex(slideIndex);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!isDragging && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        paginate(1);
      }, 5000); // Increased to 5 seconds for better UX
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDragging, paginate, slides.length]);

  // Handle drag end
  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  }, [paginate]);

  return (
    <div className="relative w-full group">
      {/* Main slider container with responsive height */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 overflow-hidden rounded-xl bg-gray-100">
        {/* Render all slides but only show current one */}
        {slides.map((slide, slideIndex) => (
          <motion.div
            key={`${slideIndex}-${slide.src}`}
            initial={false}
            animate={{
              x: `${(slideIndex - index) * 100}%`,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            whileDrag={{ 
              scale: 0.98,
              transition: { duration: 0.2 }
            }}
            className="absolute w-full h-full cursor-grab active:cursor-grabbing rounded-2xl"
            style={{
              pointerEvents: slideIndex === index ? 'auto' : 'none'
            }}
          >
            {/* Responsive image container - Full width, no cropping */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-contain select-none pointer-events-none rounded-2xl"
                priority={slideIndex === index}
                sizes="100vw"
              />
            </div>
            
            {/* Content overlay - Bottom right glassmorphism card */}
            {slideIndex === index && (slide?.title || slide?.description || slide?.clickUrl) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-end justify-end p-4 sm:p-6 lg:p-8 pointer-events-none"
              >
                {/* Glassmorphism card for text content */}
                <motion.div 
                  initial={{ opacity: 0, x: 30, y: 30 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="backdrop-blur-md bg-white/85 dark:bg-gray-900/85 rounded-2xl shadow-2xl border border-white/30 p-3 sm:p-4 max-w-[280px] sm:max-w-xs"
                >
                  {slide?.title && (
                    <h2 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 text-gray-900 dark:text-white leading-tight">
                      {slide.title}
                    </h2>
                  )}
                  {slide?.description && (
                    <p className="text-xs sm:text-sm mb-2.5 text-gray-700 dark:text-gray-200 leading-snug line-clamp-2">
                      {slide.description}
                    </p>
                  )}
                  {slide?.clickUrl && (
                    <a 
                      href={slide.clickUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto inline-block"
                    >
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                      >
                        Shop Now
                      </Button>
                    </a>
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Navigation arrows - only show on hover and if more than 1 slide */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots - only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`transition-all duration-300 rounded-full ${
                slideIndex === index
                  ? 'w-8 h-2 bg-blue-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${slideIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;