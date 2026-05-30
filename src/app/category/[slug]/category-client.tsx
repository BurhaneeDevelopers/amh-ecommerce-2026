"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { useGetProductsByCategory, useGetProductsByCategorySlug } from "@/api/products.service";
import { useGetCategoryWithNestedSubcategories } from "@/api/category.service";
import ProductCard from "@/components/blocks/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import CategorySidebar from "@/components/products/category-sidebar";
import { useState, useMemo } from "react";
import Image from "next/image";

export default function CategoryPageClient() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: category, isLoading: categoryLoading } = useGetCategoryWithNestedSubcategories(categorySlug);
  
  // Fetch products based on selected category or main category
  const categoryIdToFetch = selectedCategoryId || category?.id || "";
  const { data: allProducts = [], isLoading: productsLoading } = useGetProductsByCategorySlug(categorySlug);
  const { data: filteredProducts = [], isLoading: filteredLoading } = useGetProductsByCategory(
    categoryIdToFetch,
    undefined
  );

  // Determine which products to show
  const products = useMemo(() => {
    if (selectedCategoryId === null) {
      // Show all products from main category and all subcategories
      return allProducts;
    }
    // Show products from selected category and its subcategories
    return filteredProducts;
  }, [selectedCategoryId, allProducts, filteredProducts]);

  const isLoading = categoryLoading || (selectedCategoryId === null ? productsLoading : filteredLoading);

  if (isLoading) {
    return (
      <Container>
        <div className="mx-auto py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            </div>
            {/* Products Grid Skeleton */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container>
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Category Not Found
            </h3>
            <p className="text-gray-500">
              The category you are looking for does not exist.
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Category Banner */}
      {category.image_url && (
        <div className="w-full h-52 md:h-64 lg:h-124 relative overflow-hidden">
          <Image
            src={category.image_url}
            alt={category.name}
            width={1000}
            height={1000}
            className="w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end">
            <Container>
              <div className="pb-2 md:pb-8">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 font-montserrat">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-lg text-white/90 max-w-xl line-clamp-1 hidden lg:flex">
                    {category.description}
                  </p>
                )}
              </div>
            </Container>
          </div>
        </div>
      )}

      <Container>
        <div className="mx-auto py-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          <Link 
            href="/products" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Products
          </Link>
          
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          <span className="text-gray-900 font-medium">
            {category.name}
          </span>
        </nav>

        {/* Category Header - Only show if no banner image */}
        {!category.image_url && (
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-gray-600 max-w-3xl">
                {category.description}
              </p>
            )}
          </div>
        )}

        {/* Main Content: Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategorySidebar
              mainCategory={category}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={setSelectedCategoryId}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {products.length === 0 ? (
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
                    No products available
                  </h3>
                  <p className="text-gray-500">
                    Products in this category will appear here once they are added.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
    </>
  );
}
