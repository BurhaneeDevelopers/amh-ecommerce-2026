'use client'

import { useRef, useState, useEffect } from 'react'
import ProductCard from '@/components/blocks/product-card'
import { Product } from '@/supabase/schema/schema.type'
import { Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FeaturedProductsCarouselProps {
  products: Product[]
}

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || isDragging || !scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    
    // Calculate the width of one product card (approximate)
    const cardWidth = container.scrollWidth / products.length

    const interval = setInterval(() => {
      if (container.scrollLeft >= scrollWidth - clientWidth - 10) {
        // Reset to start when reaching the end
        container.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        // Scroll by one card width
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(interval)
  }, [isPaused, isDragging, products.length])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  if (products.length === 0) return null

  return (
    <div className="relative">
      {/* Header with Pause/Play Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">
            Discover our handpicked selection of premium products
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className="shrink-0"
          aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
        >
          {isPaused ? (
            <Play className="w-4 h-4" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Gradient Overlays for visual effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(100%-32px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-10.667px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-12.8px)] min-w-[200px] max-w-[280px]"
              style={{ userSelect: 'none' }}
            >
              <ProductCard {...product} viewMode="grid" />
            </div>
          ))}
        </div>
      </div>

      {/* Instruction Text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        Drag to browse • Auto-scrolling {isPaused ? 'paused' : 'active'}
      </p>
    </div>
  )
}
