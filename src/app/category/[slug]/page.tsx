"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { useGetProductsByCategoryInfinite, ProductFilters } from "@/api/products.service";
import { useGetSingleCategory, useGetSubCatBasedOnMainCatId } from "@/api/category.service";
import CategorySearchBar from "@/components/products/category-search-bar";
import CategoryFiltersSidebar from "@/components/products/category-filters-sidebar";
import ProductsGrid from "@/components/products/products-grid";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryContent = () => {
  const params = useParams();
  const categorySlug = params.slug as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy] = useState("featured");
  const [viewMode] = useState<"grid" | "list">("grid");

  // Get category by slug
  const { data: category, isLoading: categoryLoading } = useGetSingleCategory(categorySlug);
  const { data: subcategories = [] } = useGetSubCatBasedOnMainCatId(category?.id);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build the categories array for filtering
  const selectedCategories = useMemo(() => {
    if (!category?.id) return [];
    
    // If no subcategories selected, show all products from main category
    if (selectedSubcategories.length === 0) {
      return [category.id];
    }
    
    // Otherwise, show only selected subcategories
    return selectedSubcategories;
  }, [category?.id, selectedSubcategories]);

  // Expand categories to include subcategories when main category is selected
  const expandedCategories = useMemo(() => {
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
  }, [category, subcategories, selectedSubcategories]);

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

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

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
      <div className="mx-auto py-8">
        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category.category_name}
          </h1>
        </div>

        {/* Simplified Search Bar with Bulk Quote */}
        <CategorySearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalProducts={totalCount}
          filteredCount={displayedProductsCount}
          categoryName={category.category_name}
        />

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Category-specific Filters Sidebar */}
          <CategoryFiltersSidebar
            mainCategoryId={category.id || ''}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onClearFilters={clearFilters}
          />

          {/* Products Grid */}
          <main className="flex-1">
            <ProductsGrid
              categoryGroups={categoryGroups}
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
