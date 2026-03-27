"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X, Loader2, Package, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchProducts } from "@/api/search.service";
import { Product } from "@/supabase/schema/schema.type";
import WishlistButton from "./wishlist-button";
import GetQuoteModal from "../modals/get-quote-modal";
import Image from "next/image";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Highlights matching text in a string
 */
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-300 text-gray-900 font-semibold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

/**
 * Product search result item
 */
const SearchResultItem = ({ product, searchQuery, onClose }: { product: Product; searchQuery: string; onClose: () => void }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const productImage = product.photos?.[0];
  const productName = product.product_name || "Unnamed Product";
  const modelNumber = product.model_number || "";
  const brandName = product.brand?.brand_name || "";
  const categoryName = product.category?.category_name || "";
  const isOutOfStock = !product.stock_status || (product.on_hand_qty ?? 0) <= 0;

  const handleGetQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuoteModalOpen(true);
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
    window.location.href = `/products/${product.id}`;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg transition-colors border border-gray-200 hover:border-[#ff6b35]">
        {/* Product Image */}
        <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          {productImage ? (
            <Image
              width={500}
              height={500}
              src={productImage}
              alt={productName}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <Package className="w-6 h-6 text-gray-400" />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
            <HighlightText text={productName} highlight={searchQuery} />
          </h4>
          {modelNumber && (
            <p className="text-xs text-gray-600 truncate mt-0.5">
              Model: <HighlightText text={modelNumber} highlight={searchQuery} />
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {brandName && (
              <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                {brandName}
              </span>
            )}
            {categoryName && (
              <span className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded">
                {categoryName}
              </span>
            )}
            {isOutOfStock ? (
              <span className="text-xs text-red-600 font-medium border border-red-200 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            ) : (
              <span className="text-xs text-green-600 font-medium border border-green-200 px-2 py-0.5 rounded">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
          <Button
            onClick={handleGetQuote}
            size="sm"
            className={`h-9 px-4 text-xs font-medium whitespace-nowrap ${isOutOfStock
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gradient-to-r from-[#ff6b35] to-[#8b5cf6] hover:opacity-90 text-white"
              }`}
          >
            {isOutOfStock ? "Pre-Order" : "Get Quote"}
          </Button>
          <button
            onClick={handleViewProduct}
            className="p-2 rounded-md transition-all duration-200 hover:scale-105 border border-gray-200 hover:border-[#ff6b35]"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            <WishlistButton product_id={product.id ?? ""} compact />
          </div>
        </div>
      </div>

      {/* Get Quote Modal */}
      <GetQuoteModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        product={{
          id: product.id,
          product_name: productName,
          model_number: modelNumber,
          photos: product.photos,
        }}
      />
    </>
  );
};

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const { data: products, isLoading, isFetching } = useSearchProducts(
    debouncedSearchQuery,
    open && debouncedSearchQuery.length > 0
  );

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const showResults = debouncedSearchQuery.length > 0;
  const hasResults = products && products.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[calc(100vw-2rem)] max-h-[90vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#8b5cf6] bg-clip-text text-transparent">
            Search Products
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by product name or model number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-11"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 min-h-0">
          {!showResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">
                Start typing to search for products
              </p>
            </div>
          )}

          {showResults && (isLoading || isFetching) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#ff6b35]" />
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          )}

          {showResults && !isLoading && !isFetching && !hasResults && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-700 font-medium mb-1">No products found</p>
              <p className="text-gray-500 text-sm">
                Try searching with different keywords
              </p>
            </div>
          )}

          {showResults && !isLoading && !isFetching && hasResults && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-3">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              {products.map((product) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  searchQuery={debouncedSearchQuery}
                  onClose={handleClose}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
