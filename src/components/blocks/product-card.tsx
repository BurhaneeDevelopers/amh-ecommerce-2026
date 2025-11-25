import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import WishlistButton from "./wishlist-button";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Product } from "@/supabase/schema/schema.type";
import GetQuoteModal from "../modals/get-quote-modal";
import { Card, CardContent } from "../ui/card";

// Define badge variants based on `tag`
type BadgeVariant = "on sale" | "out of stock" | "featured" | null;

const badgeStyles: Record<Exclude<BadgeVariant, null>, string> = {
  "on sale": "bg-red-500",
  "out of stock": "bg-gray-500",
  featured: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse",
};

const badgeLabels: Record<Exclude<BadgeVariant, null>, string> = {
  "on sale": "On Sale!",
  "out of stock": "Out of Stock",
  featured: "Featured",
};

interface ProductCardProps extends Product {
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  product_name,
  model_number,
  photos,
  on_hand_qty,
  is_on_sale,
  is_featured,
  stock_status,
  viewMode = 'grid',
}) => {
  const router = useRouter();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Determine badge based on product properties
  const badge: BadgeVariant =
    !stock_status || on_hand_qty <= 0
      ? "out of stock"
      : is_on_sale
      ? "on sale"
      : is_featured
      ? "featured"
      : null;

  const handleViewProduct = () => {
    if (id) {
      router.push(`/products/${id}`);
    }
  };
  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card className={`group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-xl ${
        badge === "featured" 
          ? "border-2 border-yellow-400 shadow-[0_0_5px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)]" 
          : "border-gray-200"
      }`}>
        <CardContent className="p-0 h-full">
          <div className="flex flex-row gap-4 p-4">
            {/* Product Image Container - Smaller fixed size for list view */}
            <div className="relative overflow-hidden bg-white flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-lg border border-gray-100">
              <Image
                width={200}
                height={200}
                src={
                  photos[0] ??
                  "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
                }
                alt={product_name}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badge */}
              {badge && (
                <Badge
                  className={`absolute top-2 right-2 ${badgeStyles[badge]} border-0 shadow-md font-medium px-2 py-1 text-[9px] ${badge === "featured" ? "font-bold" : ""}`}
                >
                  {badgeLabels[badge]}
                </Badge>
              )}
            </div>

            {/* Product Info - Takes remaining space */}
            <div className="flex flex-col flex-grow justify-between min-w-0">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {product_name}
                </h3>
                {model_number && (
                  <p className="text-sm text-gray-500 font-medium truncate">
                    {model_number}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleGetQuote}
                  size="sm"
                  className={`flex-1 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                    badge === "out of stock"
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  }`}
                >
                  {badge === "out of stock" ? "Pre-Order" : "Get Quote"}
                </Button>
                <button
                  onClick={handleViewProduct}
                  className="bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-sm transition-all duration-200 hover:scale-105 border border-gray-200"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <WishlistButton product_id={id ?? ""} />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Get Quote Modal */}
        <GetQuoteModal
          open={isQuoteModalOpen}
          onOpenChange={setIsQuoteModalOpen}
          product={{
            id: id,
            product_name,
            model_number,
            photos,
          }}
        />
      </Card>
    );
  }

  // Grid view layout (default) - Compact design
  return (
    <Card className={`group relative overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-lg flex flex-col ${
      badge === "featured" 
        ? "border-2 border-yellow-400 shadow-[0_0_5px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)]" 
        : "border-gray-200"
    }`}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Product Image Container - Fixed aspect ratio with compact padding */}
        <div className="relative overflow-hidden bg-white aspect-square flex-shrink-0 border-b border-gray-100">
          <Image
            width={400}
            height={400}
            src={
              photos[0] ??
              "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
            }
            alt={product_name}
            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Button - Top left, smaller */}
          <div className="absolute top-1 left-1">
            <WishlistButton product_id={id ?? ""} compact />
          </div>

          {/* View Button - Bottom right, smaller */}
          <div className="absolute bottom-1 right-1">
            <button
              onClick={handleViewProduct}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-1.5 rounded-md shadow-sm transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
            </button>
          </div>

          {/* Badge - Smaller */}
          {badge && (
            <Badge
              className={`absolute top-1 right-1 ${badgeStyles[badge]} border-0 shadow-sm font-medium px-1.5 py-0.5 text-[8px] sm:text-[9px] ${badge === "featured" ? "font-bold" : ""}`}
            >
              {badgeLabels[badge]}
            </Badge>
          )}
        </div>

        {/* Product Info - Compact spacing */}
        <div className="flex flex-col flex-grow p-2 sm:p-2.5 justify-between min-h-[85px] sm:min-h-[95px]">
          <div className="space-y-0.5 flex-grow">
            <h3 className="font-semibold text-gray-900 text-[11px] sm:text-xs leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product_name}
            </h3>
            {model_number && (
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium truncate">
                {model_number}
              </p>
            )}
          </div>

          {/* Get Quote Button - Compact */}
          <Button
            onClick={handleGetQuote}
            size="sm"
            className={`w-full mt-1.5 sm:mt-2 h-7 sm:h-8 rounded-md font-medium text-[10px] sm:text-xs transition-all duration-200 ${
              badge === "out of stock"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {badge === "out of stock" ? "Pre-Order" : "Get Quote"}
          </Button>
        </div>
      </CardContent>

      {/* Get Quote Modal */}
      <GetQuoteModal
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        product={{
          id: id,
          product_name,
          model_number,
          photos,
        }}
      />
    </Card>
  );
};

export default ProductCard;
