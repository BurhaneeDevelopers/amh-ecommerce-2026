'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/blocks/product-card'
import { Product } from '@/supabase/schema/schema.type'
import { Loader2 } from 'lucide-react'
import { useGetAllCategories } from '@/api/category.service'

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
  const { data: allCategories = [] } = useGetAllCategories()

  // Always group products by category hierarchy (main category -> subcategories)
  const groupedProducts = useMemo(() => {
    if (products.length === 0) return []

    // Create a map of main categories to their subcategories and products
    const mainCategoryMap = new Map<string, {
      mainCategory: { id: string; name: string };
      mainCategoryProducts: Product[];
      subcategories: Map<string, { category: { id: string; name: string }; products: Product[] }>;
    }>()

    // First, organize products by their categories
    products.forEach(product => {
      const categoryId = product.category_id
      if (!categoryId) return

      const category = allCategories.find(c => c.id === categoryId)
      if (!category) return

      if (category.type === 'main') {
        // Product belongs directly to main category
        if (!mainCategoryMap.has(categoryId)) {
          mainCategoryMap.set(categoryId, {
            mainCategory: { id: categoryId, name: category.category_name },
            mainCategoryProducts: [],
            subcategories: new Map()
          })
        }
        mainCategoryMap.get(categoryId)!.mainCategoryProducts.push(product)
      } else if (category.type === 'sub' && category.parent_id) {
        // Product belongs to subcategory
        const parentId = category.parent_id
        const parentCategory = allCategories.find(c => c.id === parentId)
        
        if (!mainCategoryMap.has(parentId)) {
          mainCategoryMap.set(parentId, {
            mainCategory: { 
              id: parentId, 
              name: parentCategory?.category_name || 'Unknown Category' 
            },
            mainCategoryProducts: [],
            subcategories: new Map()
          })
        }

        const mainCatData = mainCategoryMap.get(parentId)!
        if (!mainCatData.subcategories.has(categoryId)) {
          mainCatData.subcategories.set(categoryId, {
            category: { id: categoryId, name: category.category_name },
            products: []
          })
        }
        mainCatData.subcategories.get(categoryId)!.products.push(product)
      }
    })

    // Convert to array and sort
    const result: Array<{
      type: 'main' | 'sub';
      mainCategoryId: string;
      mainCategoryName: string;
      categoryId: string;
      categoryName: string;
      products: Product[];
    }> = []

    // Sort main categories alphabetically
    const sortedMainCategories = Array.from(mainCategoryMap.entries()).sort((a, b) => 
      a[1].mainCategory.name.localeCompare(b[1].mainCategory.name)
    )

    sortedMainCategories.forEach(([mainCatId, data]) => {
      // Add main category products if any
      if (data.mainCategoryProducts.length > 0) {
        result.push({
          type: 'main',
          mainCategoryId: mainCatId,
          mainCategoryName: data.mainCategory.name,
          categoryId: mainCatId,
          categoryName: data.mainCategory.name,
          products: data.mainCategoryProducts
        })
      }

      // Add subcategories sorted alphabetically
      const sortedSubcategories = Array.from(data.subcategories.entries()).sort((a, b) =>
        a[1].category.name.localeCompare(b[1].category.name)
      )

      sortedSubcategories.forEach(([subCatId, subData]) => {
        result.push({
          type: 'sub',
          mainCategoryId: mainCatId,
          mainCategoryName: data.mainCategory.name,
          categoryId: subCatId,
          categoryName: subData.category.name,
          products: subData.products
        })
      })
    })

    return result
  }, [products, allCategories])

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

  // Always render grouped products by category hierarchy
  return (
    <div className="space-y-8">
      {/* Filtering Loading Overlay */}
      {isFiltering && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Applying filters...</span>
          </div>
        </div>
      )}

      {/* Grouped Products by Category Hierarchy */}
      {groupedProducts.map((group, index) => (
        <div key={`${group.categoryId}-${index}`} className="space-y-4">
          {/* Category Header */}
          <div className="border-b-2 border-gray-200 pb-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              {group.type === 'sub' && (
                <span className="text-sm text-gray-500 font-medium">
                  {group.mainCategoryName} →
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {group.categoryName}
              </h2>
              <span className="text-sm font-normal text-gray-500">
                ({group.products.length} {group.products.length === 1 ? 'product' : 'products'})
              </span>
            </div>
            {group.type === 'main' && (
              <p className="text-sm text-gray-500 mt-1">
                Products directly in this category
              </p>
            )}
          </div>

          {/* Products Grid for this Category */}
          <div
            className={`grid gap-2 sm:gap-3 md:gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                : 'grid-cols-1'
            } ${isFiltering ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {group.products.map((product) => (
              <div
                key={product.id}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              >
                <ProductCard {...product} viewMode={viewMode} />
              </div>
            ))}
          </div>
        </div>
      ))}

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
