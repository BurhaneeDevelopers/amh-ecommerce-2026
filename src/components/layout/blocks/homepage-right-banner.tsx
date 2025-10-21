'use client';

import React from 'react';
import Image from 'next/image';
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

  const content = (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <Image
        src={ad.media_url}
        alt={ad.title}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {/* Optional overlay with title/description */}
      {(ad.title || ad.description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          {ad.title && (
            <h3 className="text-white font-semibold text-lg mb-1">{ad.title}</h3>
          )}
          {ad.description && (
            <p className="text-white/90 text-sm">{ad.description}</p>
          )}
        </div>
      )}
    </div>
  );

  // If ad has click URL, make it clickable
  if (ad.click_url) {
    return (
      <a 
        href={ad.click_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default HomepageRightBanner;
