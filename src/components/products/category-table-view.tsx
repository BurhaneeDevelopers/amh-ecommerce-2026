'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Product } from '@/supabase/schema/schema.type'
import { Loader2, Eye, ShoppingCart, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import WishlistButton from '@/components/blocks/wishlist-button'
import GetQuoteModal from '@/components/modals/get-quote-modal'
import { useCanViewQuantity } from '@/hooks/useCanViewQuantity'
import Image from 'next/image'

interface CategoryGroup {
  categoryId: string
  categoryName: string
  categoryType: 'main' | 'sub'
  parentId: string | null
  parentName: string | null
  isFeatured: boolean
  order: number
  products: Product[]
}

interface CategoryTableViewProps {
  categoryGroups: CategoryGroup[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  onClearFilters: () => void
  isFiltering?: boolean
}

interface ProductWithCategory extends Product {
  categoryName: string
  categoryType: 'main' | 'sub'
}

const ProductTableRow = ({ product, showStock }: { product: ProductWithCategory; showStock: boolean }) => {
  const router = useRouter()
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  const badge =
    !product.stock_status || product.on_hand_qty <= 0
      ? 'out of stock'
      : product.is_on_sale
        ? 'on sale'
        : product.is_featured
          ? 'featured'
          : null

  const handleViewProduct = () => {
    if (product.id) {
      router.push(`/products/${product.id}`)
    }
  }

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Image */}
        <td className="py-3 px-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              width={500}
              height={500}
              src={
                product.photos[0] ??
                'https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg'
              }
              alt={product.product_name}
              className="w-full h-full object-contain rounded-lg"
            />
            {badge === 'featured' && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
            )}
          </div>
        </td>

        {/* Product Name */}
        <td className="py-3 px-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {product.product_name}
            </h3>
            {badge && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit ${badge === 'featured'
                    ? 'bg-yellow-100 text-yellow-800'
                    : badge === 'on sale'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {badge === 'featured' ? '⭐ Featured' : badge === 'on sale' ? '🔥 Sale' : 'Out of Stock'}
              </span>
            )}
          </div>
        </td>

        {/* Model Number */}
        <td className="py-3 px-4">
          {product.model_number ? (
            <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
              {product.model_number}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>

        {/* Category */}
        <td className="py-3 px-4">
          <span className="text-sm text-gray-700">
            {product.categoryName || product.category?.category_name || '-'}
          </span>
        </td>

        {/* Brand */}
        <td className="py-3 px-4">
          <span className="text-sm text-gray-700">
            {product.brand?.brand_name || '-'}
          </span>
        </td>

        {/* Stock Status - Only show if user has permission */}
        {showStock && (
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${product.on_hand_qty > 10
                    ? 'bg-green-500'
                    : product.on_hand_qty > 0
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
              />
              <span className="text-sm font-medium text-gray-700">
                {product.on_hand_qty > 0 ? `${product.on_hand_qty} in stock` : 'Out of stock'}
              </span>
            </div>
          </td>
        )}

        {/* Actions */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              size="sm"
              className={`h-9 px-3 text-xs font-semibold ${badge === 'out of stock'
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-primary hover:bg-primary/90'
                }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              {badge === 'out of stock' ? 'Pre-Order' : 'Quote'}
            </Button>
            <button
              onClick={handleViewProduct}
              className="h-9 w-9 rounded-lg border-2 border-gray-300 hover:border-primary bg-white hover:bg-primary/5 transition-all flex items-center justify-center"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
            <WishlistButton product_id={product.id ?? ''} />
          </div>
        </td>
      </tr>

      <GetQuoteModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        product={{
          id: product.id,
          product_name: product.product_name,
          model_number: product.model_number,
          photos: product.photos,
        }}
      />
    </>
  )
}

export default function CategoryTableView({
  categoryGroups,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  onClearFilters,
  isFiltering = false,
}: CategoryTableViewProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { canViewQuantity, isLoading: isLoadingAuth } = useCanViewQuantity()

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

  // Flatten all products from all category groups into a single array
  const allProducts: ProductWithCategory[] = categoryGroups.flatMap(group =>
    group.products.map(product => ({
      ...product,
      categoryName: group.categoryName,
      categoryType: group.categoryType,
    }))
  )

  const totalProducts = allProducts.length

  if (totalProducts === 0) {
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
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

  // Don't render table until we know if user can view stock
  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
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

      {/* Single Unified Table */}
      <div
        className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${isFiltering ? 'opacity-60 pointer-events-none' : ''
          }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Model
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Brand
                </th>
                {canViewQuantity && (
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                )}
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <ProductTableRow key={product.id} product={product} showStock={canViewQuantity} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading Indicator for Infinite Scroll */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more products...</span>
          </div>
        )}
        {!hasNextPage && totalProducts > 0 && (
          <p className="text-gray-500 text-center">
            You&apos;ve reached the end of our product catalog
          </p>
        )}
      </div>
    </div>
  )
}
