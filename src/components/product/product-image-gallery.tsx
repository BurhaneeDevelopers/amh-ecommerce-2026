'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  badge?: {
    type: 'on sale' | 'out of stock' | 'featured'
    label: string
    className: string
  } | null
}

export default function ProductImageGallery({ images, productName, badge }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const productImages = images && images.length > 0 
    ? images 
    : ["/api/placeholder/600/600"]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="space-y-4 w-full flex-grow">
      {/* Main Image */}
      <div className="relative group">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <Image
            src={productImages[selectedImageIndex]}
            alt={productName}
            fill
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Badge */}
          {badge && (
            <Badge className={`${badge.className} absolute top-4 right-4 shadow-md`}>
              {badge.label}
            </Badge>
          )}

          {/* Navigation arrows for multiple images */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Images */}
      {productImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 aspect-square w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain p-2 bg-white"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Image counter */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {selectedImageIndex + 1} of {productImages.length} image{productImages.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
