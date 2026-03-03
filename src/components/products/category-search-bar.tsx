'use client'

import { Search, FileText, Grid3x3, List, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { current_user_auth_atom } from '@/jotai/store'
import BulkQuoteModal from '@/components/modals/bulk-quote-modal'

interface CategorySearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  totalProducts: number
  filteredCount: number
  categoryName: string
  products?: Array<{
    id: string
    product_name: string
    model_number?: string
    photos: string[]
  }>
  viewMode?: 'grid' | 'table'
  onViewModeChange?: (mode: 'grid' | 'table') => void
}

export default function CategorySearchBar({
  searchQuery,
  setSearchQuery,
  totalProducts,
  filteredCount,
  categoryName,
  products = [],
  viewMode = 'grid',
  onViewModeChange,
}: CategorySearchBarProps) {
  const [isBulkQuoteOpen, setIsBulkQuoteOpen] = useState(false)
  const user = useAtomValue(current_user_auth_atom)
  
  // Check if user has permission to export (admin or dealer)
  const canExport = user?.role === 'admin' || user?.role === 'dealer'

  return (
    <>
      <div className="mb-8">
        {/* Search Bar and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder={`Search in ${categoryName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 h-12 text-base border-2 focus:border-primary transition-colors shadow-sm"
            />
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`h-12 px-4 flex items-center gap-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                <Grid3x3 className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Grid</span>
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`h-12 px-4 flex items-center gap-2 transition-colors border-l-2 border-gray-200 ${
                  viewMode === 'table'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Table View"
              >
                <List className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Table</span>
              </button>
            </div>
          )}

          {/* Export Pricelist Button - Only visible to admin and dealer */}
          {canExport && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export Pricelist
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="text-center py-2">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Coming Soon!</p>
                  <p className="text-xs text-gray-600">
                    Export pricelist feature will be available soon.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Bulk Quote Button */}
          <Button
            onClick={() => setIsBulkQuoteOpen(true)}
            size="lg"
            className="h-12 px-6 font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
          >
            <FileText className="w-5 h-5 mr-2" />
            Request Bulk Quote
          </Button>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          {searchQuery ? (
            <span>
              Found <span className="font-semibold text-gray-900">{filteredCount}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalProducts}</span> products
            </span>
          ) : (
            <span>
              Showing <span className="font-semibold text-gray-900">{totalProducts}</span> products
            </span>
          )}
        </div>
      </div>

      {/* Bulk Quote Modal */}
      <BulkQuoteModal
        open={isBulkQuoteOpen}
        onOpenChange={setIsBulkQuoteOpen}
        products={products}
      />
    </>
  )
}
