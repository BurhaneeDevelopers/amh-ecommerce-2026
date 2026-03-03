"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsByCategoryInfinite, ProductFilters } from "@/api/products.service";
import { useGetSingleCategory, useGetSubCatBasedOnMainCatId } from "@/api/category.service";
import CategorySearchBar from "@/components/products/category-search-bar";
import CategoryFiltersSidebar from "@/components/products/category-filters-sidebar";
import ProductsGrid from "@/components/products/products-grid";
import CategoryTableView from "@/components/products/category-table-view";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.slug as string;
  const brandFromUrl = searchParams.get('brand');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Get category by slug
  const { data: category, isLoading: categoryLoading } = useGetSingleCategory(categorySlug);
  const { data: subcategories = [] } = useGetSubCatBasedOnMainCatId(category?.id);

  // Check if this is the "all" category (special case for showing all products)
  const isAllCategory = categorySlug === 'all';

  // Set brand filter from URL on mount or when brand parameter changes
  useEffect(() => {
    if (brandFromUrl) {
      setSelectedBrands([brandFromUrl]);
    }
  }, [brandFromUrl]);

  // Reset filters when category changes
  useEffect(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSelectedSubcategories([]);
    // Only reset brands if there's no brand in URL
    if (!brandFromUrl) {
      setSelectedBrands([]);
    }
    setPriceRange([0, 1000]);
  }, [categorySlug, brandFromUrl]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build the categories array for filtering
  const selectedCategories = useMemo(() => {
    // If "all" category, don't filter by category
    if (isAllCategory) return [];
    
    if (!category?.id) return [];
    
    // If no subcategories selected, show all products from main category
    if (selectedSubcategories.length === 0) {
      return [category.id];
    }
    
    // Otherwise, show only selected subcategories
    return selectedSubcategories;
  }, [category?.id, selectedSubcategories, isAllCategory]);

  // Expand categories to include subcategories when main category is selected
  const expandedCategories = useMemo(() => {
    // If "all" category, don't filter by category
    if (isAllCategory) return [];
    
    if (!category?.id) return [];
    
    const expanded = new Set<string>();
    
    // Always include the main category
    expanded.add(category.id);
    
    // If no subcategories are selected, include all subcategories
    if (selectedSubcategories.length === 0 && category.type === 'main') {
      subcategories.forEach(subCat => {
        if (subCat.id) expanded.add(subCat.id);
      });
    } else {
      // Include only selected subcategories
      selectedSubcategories.forEach(subId => expanded.add(subId));
    }
    
    return Array.from(expanded);
  }, [category, subcategories, selectedSubcategories, isAllCategory]);

  // Create filters object
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
    isFetching,
  } = useGetProductsByCategoryInfinite(filters);

  // Flatten all pages into category groups
  const categoryGroups = useMemo(() => {
    return data?.pages.flatMap(page => page.categoryGroups) ?? [];
  }, [data]);

  // Get total count
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const displayedProductsCount = useMemo(() => {
    return categoryGroups.reduce((sum, group) => sum + group.products.length, 0);
  }, [categoryGroups]);

  // Flatten all products for bulk quote
  const allProducts = useMemo(() => {
    return categoryGroups.flatMap(group => 
      group.products.map(product => ({
        id: product.id || '',
        product_name: product.product_name,
        model_number: product.model_number,
        photos: product.photos || []
      }))
    );
  }, [categoryGroups]);

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  if (categoryLoading && !isAllCategory) {
    return (
      <Container>
        <div className="mx-auto space-y-4 py-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
      </Container>
    );
  }

  if (!category && !isAllCategory) {
    return (
      <Container>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Category not found</h1>
        </div>
      </Container>
    );
  }

  const displayCategoryName = isAllCategory ? 'All Products' : category?.category_name || '';

  return (
    <Container>
      <div className="mx-auto py-8">
        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayCategoryName}
          </h1>
        </div>

        {/* Search Bar with View Toggle and Bulk Quote */}
        <CategorySearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalProducts={totalCount}
          filteredCount={displayedProductsCount}
          categoryName={displayCategoryName}
          products={allProducts}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Category-specific Filters Sidebar */}
          <CategoryFiltersSidebar
            mainCategoryId={isAllCategory ? '' : (category?.id || '')}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onClearFilters={clearFilters}
          />

          {/* Products Grid or Table */}
          <main className="flex-1">
            {viewMode === 'table' ? (
              <CategoryTableView
                categoryGroups={categoryGroups}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                onClearFilters={clearFilters}
                isFiltering={isFetching && !isFetchingNextPage}
              />
            ) : (
              <ProductsGrid
                categoryGroups={categoryGroups}
                viewMode="grid"
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                onClearFilters={clearFilters}
                isFiltering={isFetching && !isFetchingNextPage}
              />
            )}
          </main>
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
