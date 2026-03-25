'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useGetAdsByPlacement } from '@/api/ads.service';
import Image from 'next/image';

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
    <div className="relative w-full bg-orange-50 py-8">
      <div className="w-full px-4 lg:px-6">
        {/* Main slider container - aspect ratio capped to viewport height */}
        <div className="relative w-full aspect-[16/9] max-h-[70vh] overflow-hidden group bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl">
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
              className="absolute w-full h-full cursor-grab active:cursor-grabbing rounded-2xl!"
              style={{
                pointerEvents: slideIndex === index ? 'auto' : 'none'
              }}
            >
              {/* Responsive image container - contains full poster without cropping */}
              <div className="relative w-full h-full overflow-hidden rounded-2xl flex items-center justify-center">
                <Image
                  width={1080}
                  height={720}
                  src={slide.src}
                  alt={slide.alt}
                  priority={slideIndex === 0}
                  className="w-fit h-full object-contain select-none pointer-events-none rounded-2xl!"
                />
              </div>

              {/* Content overlay - Bottom left with industrial theme styling */}
              {slideIndex === index && (slide?.title || slide?.description || slide?.clickUrl) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 flex items-end justify-start p-4 sm:p-6 lg:p-10 pointer-events-none"
                >
                  {/* Content card with theme colors */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 30 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-md sm:max-w-lg md:max-w-2xl space-y-3 sm:space-y-4 bg-[#2d2d2d]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 lg:p-8 border-l-4 border-[#f38b00] shadow-2xl"
                  >
                    {slide?.title && (
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase"
                        style={{
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(243,139,0,0.3)'
                        }}>
                        {slide.title}
                      </h2>
                    )}
                    {slide?.description && (
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed font-medium max-w-xl"
                        style={{
                          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                        }}>
                        {slide.description}
                      </p>
                    )}
                    {slide?.clickUrl && (
                      <a
                        href={slide.clickUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="pointer-events-auto inline-block pt-2"
                      >
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-[#f38b00] via-[#ff9500] to-[#ffed05] hover:from-[#e07a00] hover:via-[#ff8800] hover:to-[#ffd700] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
                  className={`transition-all duration-300 rounded-full ${slideIndex === index
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