"use client";
import { useState, useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsByCategory, useGetProductsByDirectCategory } from "@/api/products.service";
import { useGetCategoryWithSubcategories } from "@/api/category.service";
import ProductCard from "@/components/blocks/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

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
  
  // Get products for selected category
  // If parent has subcategories and none selected, show only direct products
  // If subcategory selected or no subcategories exist, show all products including nested
  const activeCategory = selectedSubcategory || categoryId;
  const showOnlyDirectProducts = hasSubcategories && !selectedSubcategory;
  
  const { data: allProducts = [], isLoading: allProductsLoading } = useGetProductsByCategory(
    activeCategory,
    undefined
  );
  
  const { data: directProducts = [], isLoading: directProductsLoading } = useGetProductsByDirectCategory(
    activeCategory,
    undefined
  );
  
  const products = showOnlyDirectProducts ? directProducts : allProducts;
  const productsLoading = showOnlyDirectProducts ? directProductsLoading : allProductsLoading;

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

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
                  {selectedSubcategory ? "Products" : hasSubcategories ? "All Products" : "Products"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredProducts.length} of {products.length} products
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-96" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
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
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} viewMode={viewMode} />
                  ))}
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
