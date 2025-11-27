"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsInfinite, ProductFilters } from "@/api/products.service";
import { useGetAllCategories } from "@/api/category.service";
import SearchFilters from "@/components/products/search-filters";
import FiltersSidebar from "@/components/products/filters-sidebar";
import ProductsGrid from "@/components/products/products-grid";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allCategories = [] } = useGetAllCategories();

  // Set category from URL on mount
  useEffect(() => {
    if (categoryFromUrl && allCategories.length > 0) {
      // Check if the category exists
      const categoryExists = allCategories.some(cat => cat.id === categoryFromUrl);
      if (categoryExists && !selectedCategories.includes(categoryFromUrl)) {
        setSelectedCategories([categoryFromUrl]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, allCategories]);

  // Debounce search query to prevent rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Expand main categories to include their subcategories
  const expandedCategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    
    const expanded = new Set<string>();
    
    selectedCategories.forEach(catId => {
      // Add the selected category itself
      expanded.add(catId);
      
      // Check if it's a main category
      const category = allCategories.find(c => c.id === catId);
      if (category?.type === 'main') {
        // Add all subcategories of this main category
        allCategories
          .filter(c => c.parent_id === catId)
          .forEach(subCat => {
            if (subCat.id) expanded.add(subCat.id);
          });
      }
    });
    
    return Array.from(expanded);
  }, [selectedCategories, allCategories]);

  // Create filters object for the infinite query
  const filters: ProductFilters = useMemo(() => ({
    search: debouncedSearchQuery || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    expandedCategories: expandedCategories.length > 0 ? expandedCategories : undefined,
    brands: selectedBrands.length > 0 ? selectedBrands : undefined,
    priceRange: priceRange as [number, number],
    sortBy,
  }), [debouncedSearchQuery, selectedCategories, expandedCategories, selectedBrands, priceRange, sortBy]);

  // Use infinite query for products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isPlaceholderData,
  } = useGetProductsInfinite(filters);

  // Flatten all pages into a single array
  const allProducts = useMemo(() => {
    return data?.pages.flatMap(page => page.products) ?? [];
  }, [data]);

  // Get total count from first page
  const totalCount = data?.pages[0]?.totalCount ?? 0;



  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  // Only show skeleton on initial load, not on filter changes
  if (isLoading && !isPlaceholderData) {
    return (
      <Container>
        <div className="mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-8">
              <div className="w-80 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto">
        {/* Search and Filters Header */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          totalProducts={totalCount}
          filteredCount={allProducts.length}
        />

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Filters Sidebar */}
          <FiltersSidebar
            showFilters={showFilters}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onClearFilters={clearFilters}
          />

          {/* Products Grid with Infinite Loading */}
          <main className="flex-1">
            <ProductsGrid
              products={allProducts}
              viewMode={viewMode}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              onClearFilters={clearFilters}
              isFiltering={isFetching && !isFetchingNextPage}
            />
          </main>
        </div>
      </div>
    </Container>
  );
};

const Shop = () => {
  return (
    <Suspense fallback={
      <Container>
        <div className="mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-8">
              <div className="w-80 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    }>
      <ShopContent />
    </Suspense>
  );
};

export default Shop;
