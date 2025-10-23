'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useGetTopAdByPlacement } from '@/api/ads.service';

const HomepageRightBanner: React.FC = () => {
  const { data: ad, isLoading } = useGetTopAdByPlacement('homepage_right_banner');

  if (isLoading) {
    return (
      <div className="w-full h-48 md:h-64 lg:h-80 bg-gray-200 animate-pulse rounded-xl"></div>
    );
  }

  if (!ad) {
    return null; // Don't render anything if no ad is available
  }

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <Image
        src={ad.media_url}
        alt={ad.title}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* Overlay with title, description and button */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col items-center justify-center p-4 text-center">
        {ad.title && (
          <h3 className="text-white font-semibold text-lg mb-1">{ad.title}</h3>
        )}
        {ad.description && (
          <p className="text-white/90 text-sm mb-3">{ad.description}</p>
        )}
        {ad.click_url && (
          <a href={ad.click_url} target="_blank" rel="noopener noreferrer">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-secondary text-gray-900 hover:opacity-90 font-semibold"
            >
              Learn More
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default HomepageRightBanner;
