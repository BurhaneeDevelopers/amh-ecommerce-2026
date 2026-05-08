"use client";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { useGetMainCategories, useGetAllCategoriesWithProductCount } from "@/api/category.service";
import { useGetAllProducts } from "@/api/products.service";
import CategoryCard from "@/components/blocks/category-card";
import FeaturedProductsCarousel from "@/components/products/featured-products-carousel";
import { Skeleton } from "@/components/ui/skeleton";

const CategoriesContent = () => {
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategoriesWithProductCount();
  const { data: allProducts = [], isLoading: productsLoading } = useGetAllProducts();

  if (categoriesLoading) {
    return (
      <Container>
        <div className="mx-auto py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto py-8 space-y-16">
        {/* Categories Section */}
        <div>
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of hydraulic and industrial products organized by category. Click on any category to view all available products.
            </p>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
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
                  No categories available
                </h3>
                <p className="text-gray-500">
                  Categories will appear here once they are added.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
            </div>
          )}
        </div>

        {/* All Products Carousel Section */}
        {!productsLoading && allProducts.length > 0 && (
          <div className="border-t pt-16">
            <FeaturedProductsCarousel products={allProducts} />
          </div>
        )}

        {/* Products Loading State */}
        {productsLoading && (
          <div className="border-t pt-16">
            <Skeleton className="h-12 w-64 mb-6" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="flex-none w-[calc(20%-12.8px)] h-96" />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={
      <Container>
        <div className="mx-auto py-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </Container>
    }>
      <CategoriesContent />
    </Suspense>
  );
};

export default ProductsPage;
