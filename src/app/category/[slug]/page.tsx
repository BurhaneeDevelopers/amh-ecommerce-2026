"use client";
import { useState, useMemo, Suspense, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsInfinite } from "@/api/products.service";
import { useGetCategoryWithSubcategories } from "@/api/category.service";
import ProductCard from "@/components/blocks/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

// Custom debounce hook to prevent excessive database queries on keypress
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CategoryContent = () => {
  const params = useParams();
  const categoryId = params.slug as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewMode] = useState<"grid" | "list">("grid");

  // Get main category with subcategories
  const { data: category, isLoading: categoryLoading } = useGetCategoryWithSubcategories(categoryId);
  
  const subcategories = category?.subcategories || [];
  const hasSubcategories = subcategories.length > 0;
  
  // Get products for selected category using infinite query
  const activeCategory = selectedSubcategory || categoryId;
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: productsData,
    isLoading: allProductsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetProductsInfinite({
    categories: [activeCategory],
    search: debouncedSearch
  });
  
  const products = useMemo(() => {
    return productsData?.pages.flatMap((page) => page.products) ?? [];
  }, [productsData]);

  const totalProductsCount = productsData?.pages[0]?.totalCount ?? 0;
  
  const productsLoading = allProductsLoading;

  // Intersection Observer for infinite scrolling
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, productsData]);

  if (categoryLoading) {
    return (
      <Container>
        <div className="mx-auto space-y-4 py-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Category not found</h1>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/categories" className="hover:text-blue-600">
            Categories
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {category.icon && (
              <div className="text-5xl" style={{ color: category.color }}>
                {category.icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-gray-600 mt-1">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Subcategories Section - Show only if viewing parent category */}
          {hasSubcategories && !selectedSubcategory && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Subcategories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.id}`}
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {sub.icon && (
                        <div 
                          className="text-4xl flex-shrink-0"
                          style={{ color: sub.color || '#3b82f6' }}
                        >
                          {sub.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                          {sub.name}
                        </h3>
                        {sub.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {sub.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          <div>
            {/* Section Header with Search */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {products.length} of {totalProductsCount} products
                </p>
              </div>
              
              {/* Back button if subcategory is selected */}
              {selectedSubcategory && (
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to all categories
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="min-h-[400px]">
              {productsLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5 sm:gap-2 md:gap-2.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-60 rounded-xl" />
                  ))}
                </div>
              ) : products.length === 0 ? (
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
                    <p className="text-gray-500">
                      {searchQuery 
                        ? "Try adjusting your search terms" 
                        : "Products will appear here once they are added to this category"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`grid gap-1.5 sm:gap-2 md:gap-2.5 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7' 
                      : 'grid-cols-1'
                  }`}>
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} viewMode={viewMode} />
                    ))}
                  </div>

                  {/* Load More Observer / Spinner */}
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                        <span>Loading more products...</span>
                      </div>
                    )}
                    {!hasNextPage && products.length > 0 && (
                      <p className="text-gray-400 text-sm">
                        You've reached the end of this category
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const CategoryPage = () => {
  return (
    <Suspense fallback={
      <Container>
        <div className="mx-auto space-y-4 py-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      </Container>
    }>
      <CategoryContent />
    </Suspense>
  );
};

export default CategoryPage;
