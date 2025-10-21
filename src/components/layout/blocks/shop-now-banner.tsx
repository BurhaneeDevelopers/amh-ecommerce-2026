'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useGetTopAdByPlacement } from '@/api/ads.service';

const ShopNowBanner: React.FC = () => {
  const { data: ad, isLoading } = useGetTopAdByPlacement('shop_now');

  if (isLoading) {
    return (
      <div className="w-full h-32 md:h-40 bg-gray-200 animate-pulse rounded-xl"></div>
    );
  }

  if (!ad) {
    return null; // Don't render anything if no ad is available
  }

  return (
    <div className="relative w-full h-32 md:h-40 overflow-hidden rounded-xl shadow-sm bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="absolute inset-0">
        <Image
          src={ad.media_url}
          alt={ad.title}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-between h-full p-4 md:p-6 bg-black/20">
        <div className="flex-1">
          {ad.title && (
            <h2 className="text-white font-bold text-lg md:text-2xl mb-1 drop-shadow-lg">
              {ad.title}
            </h2>
          )}
          {ad.description && (
            <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
              {ad.description}
            </p>
          )}
        </div>
        
        {ad.click_url && (
          <div className="ml-4">
            <a href={ad.click_url} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 font-semibold shadow-lg"
              >
                Shop Now
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopNowBanner;
