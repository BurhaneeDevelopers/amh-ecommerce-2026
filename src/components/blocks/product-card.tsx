'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WishlistButton from "./wishlist-button";
import { Button } from "../ui/button";
import { Eye, ShoppingCart, Sparkles } from "lucide-react";
import { Product } from "@/supabase/schema/schema.type";
import GetQuoteModal from "../modals/get-quote-modal";

// Define badge variants based on status
type BadgeVariant = "draft" | "inactive" | "active" | null;

const badgeStyles: Record<Exclude<BadgeVariant, null | 'active'>, string> = {
  "draft": "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black shadow-lg",
  "inactive": "bg-gray-500 text-white",
};

const badgeLabels: Record<Exclude<BadgeVariant, null | 'active'>, string> = {
  "draft": "📝 Draft",
  "inactive": "Inactive",
};

interface ProductCardProps extends Product {
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  sku,
  description,
  status,
  image_url,
  product_master_values,
  category,
  viewMode = 'grid',
}) => {
  const router = useRouter();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Determine badge based on product status
  const badge: BadgeVariant = status === 'active' ? null : status;

  const handleViewProduct = () => {
    if (sku) {
      router.push(`/products/${sku}`);
    }
  };

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  // Product image with proper placeholder fallback
  const productImage = image_url ?? null;

  // SVG placeholder data URI
  const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Crect x='150' y='130' width='100' height='80' rx='8' fill='%23cbd5e1'/%3E%3Ccircle cx='200' cy='270' r='20' fill='%23cbd5e1'/%3E%3Ctext x='200' y='330' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E`;

  // Extract first few master values for display
  const displayValues = (product_master_values || []).slice(0, 2).map(pmv => ({
    label: pmv.master_values?.master_fields?.label || "Spec",
    value: pmv.master_values?.value || "",
    unit: pmv.master_values?.master_fields?.unit || ""
  }));

  // List view layout
  if (viewMode === 'list') {
    return (
      <div className={`group relative overflow-hidden border-2 transition-all duration-300 bg-white rounded-xl hover:-translate-y-1 ${
        badge ? "border-gray-300 shadow-md hover:shadow-xl" : "border-gray-200 hover:border-primary shadow-md hover:shadow-xl"
      }`}>
        <div className="flex flex-row gap-6 p-4">
          {/* Product Image Container */}
          <div className="relative flex-shrink-0 w-40 h-40 rounded-lg bg-gray-50 flex items-center justify-center">
            <img
              src={productImage ?? placeholderSrc}
              alt={name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
              loading="lazy" 
              decoding="async" 
              width={160} 
              height={160}
            />

            {/* Badge */}
            {badge && badge !== 'active' && (
              <div className={`absolute top-2 right-2 ${badgeStyles[badge]} rounded-lg px-2 py-1 text-xs font-bold shadow-lg`}>
                {badgeLabels[badge]}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-grow justify-between min-w-0">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {name}
              </h3>
              {sku && (
                <p className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg inline-block">
                  SKU: {sku}
                </p>
              )}
              {category && (
                <p className="text-xs text-gray-500">
                  Category: {category.name}
                </p>
              )}
              {displayValues.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayValues.map((spec, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {spec.label}: {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleGetQuote}
                size="lg"
                disabled={status === 'inactive'}
                className={`flex-1 h-11 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                  status === 'inactive'
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:scale-105 active:scale-95"
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Get Quote
              </Button>
              <button
                onClick={handleViewProduct}
                className="h-11 px-4 rounded-xl border-2 border-gray-300 hover:border-primary bg-white hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center">
                <WishlistButton product_id={id ?? ""} />
              </div>
            </div>
          </div>
        </div>

        {/* Get Quote Modal */}
        <GetQuoteModal
          open={isQuoteModalOpen}
          onOpenChange={setIsQuoteModalOpen}
          product={{
            id: id,
            name,
            sku,
            image_url,
          }}
        />
      </div>
    );
  }

  // Grid view layout (default) - Compact and clean
  return (
    <div className={`group relative overflow-hidden border-2 transition-all duration-300 bg-white rounded-xl hover:-translate-y-1 ${
      badge ? "border-gray-300 shadow-md hover:shadow-xl" : "border-gray-200 hover:border-primary shadow-md hover:shadow-xl"
    }`}>
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] p-2 bg-gray-50 flex items-center justify-center">
        <img
          src={productImage ?? placeholderSrc}
          alt={name}
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
          loading="lazy" 
          decoding="async" 
        />

        {/* Action Buttons - Always Visible */}
        <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start z-10">
          {/* Wishlist Button */}
          <WishlistButton product_id={id ?? ""} />

          {/* Badge */}
          {badge && badge !== 'active' && (
            <div className={`${badgeStyles[badge]} rounded-lg px-2 py-0.5 text-[10px] font-bold shadow-lg`}>
              {badgeLabels[badge]}
            </div>
          )}
        </div>

        {/* View Button - Always Visible on Mobile, Center on Desktop Hover */}
        <div className="absolute bottom-1.5 right-1.5 md:bottom-0 md:right-0 md:top-0 md:left-0 md:flex md:items-center md:justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleViewProduct}
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border border-gray-200 hover:border-primary"
          >
            <Eye className="w-4 h-4 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.25rem] mb-1.5">
          {name}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {sku && (
            <span className="text-[10px] text-gray-600 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
              SKU: {sku}
            </span>
          )}

          {category && (
            <span className="text-[10px] text-gray-500 font-medium">
              {category.name}
            </span>
          )}
        </div>

        {displayValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {displayValues.map((spec, idx) => (
              <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                {spec.label}: {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
              </span>
            ))}
          </div>
        )}

        {/* Get Quote Button */}
        <Button
          onClick={handleGetQuote}
          disabled={status === 'inactive'}
          className={`w-full h-8 rounded-lg font-bold text-xs transition-all duration-300 shadow-sm hover:shadow-md ${
            status === 'inactive'
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:scale-102 active:scale-98"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          Get Quote
        </Button>
      </div>

      {/* Get Quote Modal */}
      <GetQuoteModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        product={{
          id: id,
          name,
          sku,
          image_url,
        }}
      />
    </div>
  );
};

export default ProductCard;
