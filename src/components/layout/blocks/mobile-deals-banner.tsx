'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetAdsByPlacement } from '@/api/ads.service';

const MobileDealsSection: React.FC = () => {
  const { data: ads = [], isLoading } = useGetAdsByPlacement('mobile_deals');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Show fallback content if no ads are available
  const fallbackAds = [
    {
      id: 'fallback-1',
      title: 'Special Offers',
      description: 'Check out our latest deals',
      media_url: 'https://images.pexels.com/photos/4312860/pexels-photo-4312860.jpeg',
      click_url: null
    },
    {
      id: 'fallback-2', 
      title: 'New Arrivals',
      description: 'Discover our newest products',
      media_url: 'https://images.pexels.com/photos/4889065/pexels-photo-4889065.jpeg',
      click_url: null
    }
  ];

  const displayAds = ads.length > 0 ? ads.slice(0, 2) : fallbackAds;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {displayAds.map((ad, index) => (
        <div 
          key={ad.id || index}
          className="relative h-32 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-primary/5 to-secondary/5"
        >
          <div className="absolute inset-0">
            <Image
              src={ad.media_url}
              alt={ad.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
          
          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-between h-full p-3 bg-black/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {ad.title && (
                  <h3 className="text-white font-semibold text-sm mb-1 drop-shadow-lg">
                    {ad.title}
                  </h3>
                )}
                {ad.description && (
                  <p className="text-white/90 text-xs drop-shadow-lg line-clamp-2">
                    {ad.description}
                  </p>
                )}
              </div>
              
              <Badge variant="secondary" className="bg-white/90 text-primary font-semibold ml-2">
                Deal
              </Badge>
            </div>
            
            {ad.click_url && (
              <div className="mt-2">
                <a href={ad.click_url} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary to-secondary text-gray-900 hover:opacity-90 font-semibold w-full"
                  >
                    Shop Now
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileDealsSection;
