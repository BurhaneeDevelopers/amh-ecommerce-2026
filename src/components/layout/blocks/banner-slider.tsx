'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useGetAdsByPlacement } from '@/api/ads.service';

// Fallback images if no ads are available
const fallbackImages = [
  '/banners/cordless-tool.jpg',
  '/banners/tool-box.jpg',
];

const swipeConfidenceThreshold = 8000; // smaller for more responsive swipes
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

  // Auto-slide
  useEffect(() => {
    if (!isDragging) {
      intervalRef.current = setInterval(() => {
        paginate(1);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDragging, paginate]);

  return (
    <div className="relative w-full h-40 sm:h-48 md:h-52 lg:h-56 overflow-hidden rounded-xl">
      <AnimatePresence initial={false} custom={index}>
        <motion.div
          key={index}
          custom={index}
          initial={{ x: '100%', opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }, // smoother cubic-bezier
          }}
          exit={{
            x: '-100%',
            opacity: 0,
            scale: 0.98,
            transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, { offset, velocity }) => {
            setIsDragging(false);
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          whileDrag={{ scale: 0.97 }} // subtle shrink while dragging
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            className="object-cover !object-center select-none pointer-events-none"
            priority
          />
          
          {/* Content overlay with title, description and button */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center justify-start p-6">
            <div className="text-white max-w-md">
              {slides[index]?.title && (
                <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  {slides[index].title}
                </h2>
              )}
              {slides[index]?.description && (
                <p className="text-sm md:text-base mb-4 drop-shadow-lg opacity-90">
                  {slides[index].description}
                </p>
              )}
              {slides[index]?.clickUrl && (
                <a 
                  href={slides[index].clickUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg pointer-events-auto"
                  >
                    Shop Now
                  </Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BannerSlider;