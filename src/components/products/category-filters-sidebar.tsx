'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetSubCatBasedOnMainCatId } from '@/api/category.service'
import { useGetAllBrands } from '@/api/brand.service'
import { Brand, Category } from '@/supabase/schema/schema.type'
import { X } from 'lucide-react'

interface CategoryFiltersSidebarProps {
  mainCategoryId: string
  selectedSubcategories: string[]
  setSelectedSubcategories: (categories: string[]) => void
  selectedBrands: string[]
  setSelectedBrands: (brands: string[]) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  onClearFilters: () => void
}

export default function CategoryFiltersSidebar({
  mainCategoryId,
  selectedSubcategories,
  setSelectedSubcategories,
  selectedBrands,
  setSelectedBrands,
  onClearFilters,
}: CategoryFiltersSidebarProps) {
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useGetSubCatBasedOnMainCatId(mainCategoryId)
  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrands()

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    setSelectedSubcategories(
      checked
        ? [...selectedSubcategories, subcategoryId]
        : selectedSubcategories.filter((id) => id !== subcategoryId)
    )
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(
      checked
        ? [...selectedBrands, brandId]
        : selectedBrands.filter((b) => b !== brandId)
    )
  }

  // Get active filter information
  const getActiveFilters = () => {
    const filters: Array<{ id: string; name: string; type: 'subcategory' | 'brand' }> = []
    
    selectedSubcategories.forEach(subId => {
      const subcategory = subcategories.find(c => c.id === subId)
      if (subcategory) {
        filters.push({
          id: subId,
          name: subcategory.category_name,
          type: 'subcategory'
        })
      }
    })
    
    selectedBrands.forEach(brandId => {
      const brand = brands.find(b => b.id === brandId)
      if (brand) {
        filters.push({
          id: brandId,
          name: brand.brand_name || '',
          type: 'brand'
        })
      }
    })
    
    return filters
  }

  const activeFilters = getActiveFilters()

  const removeFilter = (filterId: string, type: 'subcategory' | 'brand') => {
    if (type === 'subcategory') {
      handleSubcategoryChange(filterId, false)
    } else {
      handleBrandChange(filterId, false)
    }
  }

  return (
    <aside className="lg:w-80 space-y-6">
      <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <Badge 
                      key={filter.id} 
                      variant="secondary" 
                      className="text-xs bg-primary text-white flex items-center gap-1 pr-1"
                    >
                      <span>{filter.name}</span>
                      <button
                        onClick={() => removeFilter(filter.id, filter.type)}
                        className="ml-1 hover:bg-primary-dark rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${filter.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Subcategories</h3>
                {subcategoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {subcategories.map((subcategory: Category) => (
                      <div 
                        key={subcategory.id} 
                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSubcategoryChange(subcategory.id || '', !selectedSubcategories.includes(subcategory.id || ''))}
                      >
                        <Checkbox
                          id={`subcategory-${subcategory.id}`}
                          checked={selectedSubcategories.includes(subcategory.id || '')}
                          onCheckedChange={(checked) =>
                            handleSubcategoryChange(subcategory.id || '', checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                          {subcategory.category_name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Brands */}
            <div>
              <h3 className="font-semibold mb-3">Brands</h3>
              {brandsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {brands.map((brand: Brand) => (
                    <div 
                      key={brand.id} 
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleBrandChange(brand.id || '', !selectedBrands.includes(brand.id || ''))}
                    >
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id || '')}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand.id || '', checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm font-medium leading-none cursor-pointer flex-1"
                      >
                        {brand.brand_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
