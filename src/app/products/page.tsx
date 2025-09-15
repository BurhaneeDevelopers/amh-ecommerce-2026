"use client";
import { useState, useMemo } from "react";
import { Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useGetAllProducts } from "@/api/products.service";
import { Container } from "@/components/layout/container";
import { categories } from "@/components/constants/globals";
import { useGetAllBrands } from "@/api/brand.service";
import { Brand } from "@/supabase/schema/schema.type";
import ProductCard from "@/components/blocks/product-card";
import { H1, P } from "@/components/typography/typography";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: products = [],
    // isLoading: products_loading,
    // error: products_error,
  } = useGetAllProducts();
  const {
    data: brands = [],
    // isLoading: products_loading,
    // error: products_error,
  } = useGetAllBrands();

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.product_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product?.brand_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.category_id?.toLowerCase().includes(searchQuery.toLowerCase());

      //   Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category_id ?? "");

      //   // Brand filter
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand_id ?? "");

      //   return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => (b.created_at ? 1 : 0) - (a.created_at ? 1 : 0)
        );
        break;
      default:
        // Featured - no sorting needed
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, products, selectedCategories, selectedBrands]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setSearchQuery("");
  };

  return (
    <Container>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <H1 className="text-4xl font-display font-bold mb-2">Shop</H1>
            <P className="text-muted-foreground">
              Showing {filteredAndSortedProducts.length} of {products.length}{" "}
              products
            </P>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className="w-4 h-4" />
                ) : (
                  <Grid className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-80 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Checkbox
                          id={i.toString()}
                          checked={selectedCategories.includes(category.name)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.name,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={i.toString()}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-semibold mb-3">Brands</h3>
                  <div className="space-y-2">
                    {brands.map((brand: Brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={brand.id?.toString()}
                          checked={selectedBrands.includes(
                            brand.id?.toString() ?? ""
                          )}
                          onCheckedChange={(checked) =>
                            handleBrandChange(
                              brand.id?.toString() ?? "",
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={brand.id?.toString()}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {brand.brand_name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 ||
                  selectedBrands.length > 0) && (
                  <div>
                    <h3 className="font-semibold mb-3">Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                          <button
                            onClick={() =>
                              handleCategoryChange(category, false)
                            }
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {selectedBrands.map((brand) => (
                        <Badge
                          key={brand}
                          variant="secondary"
                          className="text-xs"
                        >
                          {brand}
                          <button
                            onClick={() => handleBrandChange(brand, false)}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No products found
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Container>
  );
};

export default Shop;
