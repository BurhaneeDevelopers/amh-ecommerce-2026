'use client';

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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

  if (ads.length === 0) {
    return null; // Don't render anything if no ads are available
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ads.slice(0, 2).map((ad, index) => {
        const content = (
          <div className="relative h-24 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-r from-primary/5 to-secondary/5">
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
            <div className="relative z-10 flex items-center h-full p-3 bg-black/30">
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
              
              <div className="ml-2">
                <Badge variant="secondary" className="bg-white/90 text-primary font-semibold">
                  Deal
                </Badge>
              </div>
            </div>
          </div>
        );

        // If ad has click URL, make it clickable
        if (ad.click_url) {
          return (
            <a 
              key={ad.id || index}
              href={ad.click_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              {content}
            </a>
          );
        }

        return (
          <div key={ad.id || index}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default MobileDealsSection;
