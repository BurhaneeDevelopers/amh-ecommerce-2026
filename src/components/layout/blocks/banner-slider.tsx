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
    <div className="relative w-full bg-gray-100 py-8">
      <div className="w-full px-4 lg:px-6">
        {/* Main slider container with proper height and rounded corners */}
        <div className="relative w-full h-[70vh] overflow-hidden rounded-2xl shadow-lg group">
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
              {/* Responsive image container */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover select-none pointer-events-none rounded-2xl"
                  priority={slideIndex === index}
                  sizes="100vw"
                />
              </div>
              
              {/* Content overlay - Bottom left with better styling */}
              {slideIndex === index && (slide?.title || slide?.description || slide?.clickUrl) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 flex items-end justify-start p-6 sm:p-8 lg:p-12 pointer-events-none"
                >
                  {/* Content card */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30, y: 30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-md space-y-4"
                  >
                    {slide?.title && (
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide?.description && (
                      <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed drop-shadow-md">
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
                          size="lg"
                          className="bg-gradient-to-r from-[#f38b00] to-[#ffed05] hover:from-[#e07a00] hover:to-[#ffd700] text-white font-bold shadow-2xl transition-all duration-300 hover:scale-110 rounded-xl px-10 py-7 text-lg"
                        >
                          Get a Quote
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Pagination dots - only show if more than 1 slide */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 z-20">
              {slides.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`transition-all duration-300 rounded-full ${
                    slideIndex === index
                      ? 'w-8 h-2 bg-white shadow-lg'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;