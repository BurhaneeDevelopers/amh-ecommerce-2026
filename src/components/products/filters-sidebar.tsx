'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useGetAllCategories } from '@/api/category.service'
import { useGetAllBrands } from '@/api/brand.service'
import { Brand, Category } from '@/supabase/schema/schema.type'

interface FiltersSidebarProps {
  showFilters: boolean
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedBrands: string[]
  setSelectedBrands: (brands: string[]) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  onClearFilters: () => void
}

export default function FiltersSidebar({
  showFilters,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  onClearFilters,
}: FiltersSidebarProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategories()
  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrands()

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(
      checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter((c) => c !== categoryId)
    )
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(
      checked
        ? [...selectedBrands, brandId]
        : selectedBrands.filter((b) => b !== brandId)
    )
  }

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => selectedCategories.includes(cat.id || ''))
      .map((cat) => cat.category_name || '')
  }

  const getSelectedBrandNames = () => {
    return brands
      .filter((brand) => selectedBrands.includes(brand.id || ''))
      .map((brand) => brand.brand_name || '')
  }

  return (
    <aside
      className={`lg:w-80 space-y-6 ${
        showFilters ? 'block' : 'hidden lg:block'
      }`}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
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
                max={1000}
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
            {categoriesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category: Category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id || '')}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id || '', checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category.category_name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-semibold mb-3">Brands</h3>
            {brandsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand: Brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id || '')}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand.id || '', checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {brand.brand_name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
            <div>
              <h3 className="font-semibold mb-3">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {getSelectedCategoryNames().map((categoryName) => (
                  <Badge key={categoryName} variant="secondary" className="text-xs">
                    {categoryName}
                    <button
                      onClick={() => {
                        const category = categories.find(c => c.category_name === categoryName)
                        if (category) {
                          handleCategoryChange(category.id || '', false)
                        }
                      }}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {getSelectedBrandNames().map((brandName) => (
                  <Badge key={brandName} variant="secondary" className="text-xs">
                    {brandName}
                    <button
                      onClick={() => {
                        const brand = brands.find(b => b.brand_name === brandName)
                        if (brand) {
                          handleBrandChange(brand.id || '', false)
                        }
                      }}
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
  )
}
