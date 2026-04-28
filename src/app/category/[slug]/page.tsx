"use client";
import { useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsByCategory } from "@/api/products.service";
import { useGetCategoryWithSubcategories, useGetSubcategoriesByParentId } from "@/api/category.service";
import ProductCard from "@/components/blocks/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

const CategoryContent = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.slug as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [viewMode] = useState<"grid" | "list">("grid");

  // Get main category with subcategories
  const { data: category, isLoading: categoryLoading } = useGetCategoryWithSubcategories(categoryId);
  
  // Get products for selected category (main or subcategory)
  const activeCategory = selectedSubcategory || categoryId;
  const { data: products = [], isLoading: productsLoading } = useGetProductsByCategory(activeCategory);

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

  const subcategories = category.subcategories || [];
  const hasSubcategories = subcategories.length > 0;

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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Subcategories */}
          {hasSubcategories && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-4">
                <h3 className="font-bold text-gray-900 mb-4">Subcategories</h3>
                <div className="space-y-1">
                  {/* All Products Option */}
                  <button
                    onClick={() => setSelectedSubcategory(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                      !selectedSubcategory
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                  </button>
                  
                  {/* Subcategory Options */}
                  {subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubcategory(sub.id!)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedSubcategory === sub.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{sub.icon}</span>
                      <span className="flex-1">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Products Area */}
          <div className="flex-1">
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
              <p className="text-sm text-gray-600 mt-2">
                Showing {filteredProducts.length} of {products.length} products
              </p>
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
