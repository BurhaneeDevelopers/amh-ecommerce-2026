"use client";

import { Category } from "@/supabase/schema/schema.type";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategorySidebarProps {
  mainCategory: Category;
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

interface CategoryItemProps {
  category: Category;
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  level?: number;
}

function CategoryItem({ 
  category, 
  selectedCategoryId, 
  onCategorySelect, 
  level = 0 
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const isSelected = selectedCategoryId === category.id;

  return (
    <div className="w-full">
      <button
        onClick={() => {
          if (hasSubcategories) {
            setIsExpanded(!isExpanded);
          }
          onCategorySelect(category.id!);
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
          "hover:bg-gray-100",
          isSelected && "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100",
          !isSelected && "text-gray-700"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        <span className="flex-1 text-left">{category.name}</span>
        {hasSubcategories && (
          <span className="ml-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {hasSubcategories && isExpanded && (
        <div className="mt-1">
          {category.subcategories!.map((subcat) => (
            <CategoryItem
              key={subcat.id}
              category={subcat}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={onCategorySelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySidebarContent({
  mainCategory,
  selectedCategoryId,
  onCategorySelect,
  onClose,
}: CategorySidebarProps & { onClose?: () => void }) {
  const hasSubcategories = mainCategory.subcategories && mainCategory.subcategories.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Categories
          </h2>
          <p className="text-sm text-gray-500">
            Filter products by category
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        {/* All Products Option */}
        <button
          onClick={() => {
            onCategorySelect(null);
            onClose?.();
          }}
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
            "hover:bg-gray-100",
            selectedCategoryId === null && "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100",
            selectedCategoryId !== null && "text-gray-700"
          )}
        >
          All {mainCategory.name}
        </button>

        {/* Main Category */}
        <button
          onClick={() => {
            onCategorySelect(mainCategory.id!);
            onClose?.();
          }}
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
            "hover:bg-gray-100",
            selectedCategoryId === mainCategory.id && "bg-blue-50 text-blue-700 font-medium hover:bg-blue-100",
            selectedCategoryId !== mainCategory.id && "text-gray-700"
          )}
        >
          {mainCategory.name} (Direct)
        </button>

        {/* Subcategories */}
        {hasSubcategories && (
          <div className="pt-2 border-t border-gray-200 mt-2">
            {mainCategory.subcategories!.map((subcat) => (
              <CategoryItem
                key={subcat.id}
                category={subcat}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={(id) => {
                  onCategorySelect(id);
                  onClose?.();
                }}
                level={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategorySidebar(props: CategorySidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          className="w-full"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter by Category
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-4">
        <CategorySidebarContent {...props} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileOpen(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <CategorySidebarContent 
                {...props} 
                onClose={() => setIsMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
