'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/blocks/product-card'
import { Product } from '@/supabase/schema/schema.type'
import { Loader2 } from 'lucide-react'

interface ProductsGridProps {
  products: Product[]
  viewMode: 'grid' | 'list'
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  onClearFilters: () => void
  isFiltering?: boolean
}

export default function ProductsGrid({
  products,
  viewMode,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onClearFilters,
  isFiltering = false,
}: ProductsGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [handleObserver])

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
          <Button onClick={onClearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtering Loading Overlay */}
      {isFiltering && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Applying filters...</span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            : 'grid-cols-1'
        } ${isFiltering ? 'opacity-60 pointer-events-none' : ''}`}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={viewMode === 'list' ? 'max-w-none' : ''}
          >
            <ProductCard {...product} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Loading Indicator for Infinite Scroll */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
        {!hasNextPage && products.length > 0 && (
          <p className="text-gray-500 text-center">
            You&apos;ve reached the end of our product catalog
          </p>
        )}
      </div>
    </div>
  )
}
