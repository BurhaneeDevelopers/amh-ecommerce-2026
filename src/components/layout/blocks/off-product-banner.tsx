'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetTopAdByPlacement } from '@/api/ads.service';

const OffProductBanner: React.FC = () => {
  const { data: ad, isLoading } = useGetTopAdByPlacement('off_product');

  if (isLoading) {
    return (
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl"></div>
    );
  }

  if (!ad) {
    return null; // Don't render anything if no ad is available
  }

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-red-50 to-orange-50">
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
      <div className="relative z-10 flex items-center justify-between h-full p-6 bg-gradient-to-r from-black/50 to-transparent">
        <div className="flex-1">
          <div className="mb-2">
            <Badge variant="destructive" className="bg-red-600 text-white font-bold text-sm">
              LIMITED OFFER
            </Badge>
          </div>
          
          {ad.title && (
            <h2 className="text-white font-bold text-xl md:text-3xl mb-2 drop-shadow-lg">
              {ad.title}
            </h2>
          )}
          
          {ad.description && (
            <p className="text-white/90 text-sm md:text-base drop-shadow-lg mb-4">
              {ad.description}
            </p>
          )}
          
          {ad.click_url && (
            <a href={ad.click_url} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
              >
                Get Deal Now
              </Button>
            </a>
          )}
        </div>
        
        {/* Optional percentage or discount badge */}
        <div className="ml-4 hidden md:block">
          <div className="bg-white/90 rounded-full p-4 text-center min-w-[80px]">
            <div className="text-red-600 font-bold text-lg">UP TO</div>
            <div className="text-red-600 font-bold text-2xl">50%</div>
            <div className="text-red-600 font-bold text-sm">OFF</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffProductBanner;
