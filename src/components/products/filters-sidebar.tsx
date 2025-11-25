'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGetAllMainCategories, useGetSubCatBasedOnMainCatId, useGetAllCategories } from '@/api/category.service'
import { useGetAllBrands } from '@/api/brand.service'
import { Brand, Category } from '@/supabase/schema/schema.type'
import { ChevronRight, X } from 'lucide-react'

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

// Component for displaying subcategories in popover
function SubcategoriesPopover({ 
  mainCategory, 
  selectedCategories, 
  onCategorySelect 
}: { 
  mainCategory: Category
  selectedCategories: string[]
  onCategorySelect: (categoryId: string, isMainCategory: boolean) => void
}) {
  const { data: subcategories = [], isLoading } = useGetSubCatBasedOnMainCatId(mainCategory.id)
  const [open, setOpen] = useState(false)

  const isMainCategorySelected = selectedCategories.includes(mainCategory.id || '')
  const hasSelectedSubcategories = subcategories.some(sub => selectedCategories.includes(sub.id || ''))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
            isMainCategorySelected || hasSelectedSubcategories 
              ? 'bg-primary/10 hover:bg-primary/20' 
              : 'hover:bg-gray-100'
          }`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex items-center space-x-2 flex-1">
            <Checkbox
              id={`main-category-${mainCategory.id}`}
              checked={isMainCategorySelected}
              onCheckedChange={() => {
                onCategorySelect(mainCategory.id || '', true)
                setOpen(false)
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <label
              htmlFor={`main-category-${mainCategory.id}`}
              className="text-sm font-medium leading-none cursor-pointer flex-1"
              onClick={(e) => {
                e.preventDefault()
                onCategorySelect(mainCategory.id || '', true)
                setOpen(false)
              }}
            >
              {mainCategory.category_name}
            </label>
          </div>
          {subcategories.length > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </PopoverTrigger>
      {subcategories.length > 0 && (
        <PopoverContent 
          side="right" 
          align="start" 
          className="w-64 p-2"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
              {mainCategory.category_name} Subcategories
            </div>
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              subcategories.map((subcategory) => (
                <div 
                  key={subcategory.id} 
                  className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onCategorySelect(subcategory.id || '', false)
                    setOpen(false)
                  }}
                >
                  <Checkbox
                    id={`sub-category-${subcategory.id}`}
                    checked={selectedCategories.includes(subcategory.id || '')}
                    onCheckedChange={() => {
                      onCategorySelect(subcategory.id || '', false)
                      setOpen(false)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`sub-category-${subcategory.id}`}
                    className="text-sm leading-none cursor-pointer flex-1"
                  >
                    {subcategory.category_name}
                  </label>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}

export default function FiltersSidebar({
  showFilters,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  onClearFilters,
}: FiltersSidebarProps) {
  const { data: mainCategories = [], isLoading: mainCategoriesLoading } = useGetAllMainCategories()
  const { data: allCategories = [] } = useGetAllCategories()
  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrands()

  // Handle category selection (both main and sub)
  const handleCategorySelect = (categoryId: string, isMainCategory: boolean) => {
    const isSelected = selectedCategories.includes(categoryId)
    
    if (isMainCategory) {
      // If selecting a main category
      if (isSelected) {
        // Remove main category and all its subcategories
        const subcategoryIds = allCategories
          .filter(c => c.parent_id === categoryId)
          .map(c => c.id || '')
        
        setSelectedCategories(
          selectedCategories.filter(id => 
            id !== categoryId && !subcategoryIds.includes(id)
          )
        )
      } else {
        // Add main category (don't auto-select subcategories)
        setSelectedCategories([...selectedCategories, categoryId])
      }
    } else {
      // If selecting a subcategory
      if (isSelected) {
        // Remove subcategory
        setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
      } else {
        // Add subcategory and remove main category if it was selected
        const subCat = allCategories.find(c => c.id === categoryId)
        const mainCategoryId = subCat?.parent_id
        
        setSelectedCategories([
          ...selectedCategories.filter(id => id !== mainCategoryId),
          categoryId
        ])
      }
    }
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
    const filters: Array<{ id: string; name: string; type: 'category' | 'brand'; isMain?: boolean; parentName?: string }> = []
    
    selectedCategories.forEach(catId => {
      const category = allCategories.find(c => c.id === catId)
      if (category) {
        const isMain = category.type === 'main'
        const parentCategory = isMain ? null : allCategories.find(c => c.id === category.parent_id)
        
        filters.push({
          id: catId,
          name: category.category_name,
          type: 'category',
          isMain,
          parentName: parentCategory?.category_name
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

  const removeFilter = (filterId: string, type: 'category' | 'brand') => {
    if (type === 'category') {
      handleCategorySelect(filterId, false)
    } else {
      handleBrandChange(filterId, false)
    }
  }

  return (
    <aside
      className={`lg:w-80 space-y-6 ${
        showFilters ? 'block' : 'hidden lg:block'
      }`}
    >
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
            {/* Active Filters - Show at top for better UX */}
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
                      <span>
                        {filter.type === 'category' && filter.parentName && (
                          <span className="opacity-70">{filter.parentName} → </span>
                        )}
                        {filter.name}
                      </span>
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

            {/* Categories with Subcategories */}
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              {mainCategoriesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {mainCategories.map((mainCategory: Category) => (
                    <SubcategoriesPopover
                      key={mainCategory.id}
                      mainCategory={mainCategory}
                      selectedCategories={selectedCategories}
                      onCategorySelect={handleCategorySelect}
                    />
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
