'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetAllCategories } from '@/api/category.service'
import { Category } from '@/supabase/schema/schema.type'
import { X } from 'lucide-react'

interface FiltersSidebarProps {
  showFilters: boolean
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  onClearFilters: () => void
  hideCategories?: boolean
}

export default function FiltersSidebar({
  showFilters,
  selectedCategories,
  setSelectedCategories,
  onClearFilters,
  hideCategories = false,
}: FiltersSidebarProps) {
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategories()

  const handleCategorySelect = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId)
    
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  // Get active filter information
  const getActiveFilters = () => {
    const filters: Array<{ id: string; name: string; type: 'category' }> = []
    
    if (!hideCategories) {
      selectedCategories.forEach(catId => {
        const category = categories.find(c => c.id === catId)
        if (category) {
          filters.push({
            id: catId,
            name: category.name,
            type: 'category'
          })
        }
      })
    }
    
    return filters
  }

  const activeFilters = getActiveFilters()

  const removeFilter = (filterId: string) => {
    handleCategorySelect(filterId)
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
                        onClick={() => removeFilter(filter.id)}
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

            {/* Categories */}
            {!hideCategories && (
              <div>
                <h3 className="font-semibold mb-3">Categories</h3>
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                    {categories.map((category: Category) => (
                      <div 
                        key={category.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          selectedCategories.includes(category.id || '')
                            ? 'bg-primary/10 hover:bg-primary/20' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategorySelect(category.id || '')}
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id || '')}
                            onCheckedChange={() => handleCategorySelect(category.id || '')}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="text-sm font-medium leading-none cursor-pointer flex-1"
                          >
                            {category.name}
                          </label>
                        </div>
                        {category.icon && (
                          <span className="text-lg">{category.icon}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
