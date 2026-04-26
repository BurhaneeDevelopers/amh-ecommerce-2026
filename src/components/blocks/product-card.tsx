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
  product_master_values,
  category,
  viewMode = 'grid',
}) => {
  const router = useRouter();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Determine badge based on product status
  const badge: BadgeVariant = status === 'active' ? null : status;

  const handleViewProduct = () => {
    if (id) {
      router.push(`/products/${id}`);
    }
  };

  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  // Placeholder image
  const productImage = "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg";

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
              src={productImage}
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
      <div className="relative aspect-square p-3 bg-gray-50">
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          loading="lazy" 
          decoding="async" 
          width={500} 
          height={300}
        />

        {/* Action Buttons - Always Visible */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Wishlist Button */}
          <WishlistButton product_id={id ?? ""} />

          {/* Badge */}
          {badge && badge !== 'active' && (
            <div className={`${badgeStyles[badge]} rounded-lg px-2 py-1 text-xs font-bold shadow-lg`}>
              {badgeLabels[badge]}
            </div>
          )}
        </div>

        {/* View Button - Always Visible on Mobile, Center on Desktop Hover */}
        <div className="absolute bottom-2 right-2 md:bottom-0 md:right-0 md:top-0 md:left-0 md:flex md:items-center md:justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleViewProduct}
            className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-gray-200 hover:border-primary"
          >
            <Eye className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem] mb-2">
          {name}
        </h3>

        {sku && (
          <p className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md inline-block mb-2">
            SKU: {sku}
          </p>
        )}

        {category && (
          <p className="text-xs text-gray-500 mb-2">
            {category.name}
          </p>
        )}

        {displayValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {displayValues.map((spec, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {spec.label}: {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
              </span>
            ))}
          </div>
        )}

        {/* Get Quote Button */}
        <Button
          onClick={handleGetQuote}
          disabled={status === 'inactive'}
          className={`w-full h-10 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
            status === 'inactive'
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:scale-105 active:scale-95"
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
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
        }}
      />
    </div>
  );
};

export default ProductCard;
