'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const images = [
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

  const paginate = (direction: number) => {
    setIndex((prev) => {
      const newIndex = prev + direction;
      if (newIndex < 0) return images.length - 1;
      if (newIndex >= images.length) return 0;
      return newIndex;
    });
  };

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
  }, [isDragging]);

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
            src={images[index]}
            alt={`Banner ${index + 1}`}
            fill
            className="object-cover !object-center select-none pointer-events-none"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BannerSlider;