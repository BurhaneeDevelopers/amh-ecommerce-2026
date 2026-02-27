import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WishlistButton from "./wishlist-button";
import { Button } from "../ui/button";
import { Eye, ShoppingCart, Sparkles } from "lucide-react";
import { Product } from "@/supabase/schema/schema.type";
import GetQuoteModal from "../modals/get-quote-modal";
import { useCanViewQuantity } from "@/hooks/useCanViewQuantity";

// Define badge variants based on `tag`
type BadgeVariant = "on sale" | "out of stock" | "featured" | null;

const badgeStyles: Record<Exclude<BadgeVariant, null>, string> = {
  "on sale": "bg-gradient-to-r from-red-500 to-red-600 text-white",
  "out of stock": "bg-gray-500 text-white",
  featured: "bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black shadow-lg animate-pulse",
};

const badgeLabels: Record<Exclude<BadgeVariant, null>, string> = {
  "on sale": "🔥 Sale",
  "out of stock": "Out of Stock",
  featured: "⭐ Featured",
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
  const canViewQuantity = useCanViewQuantity();

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
      <div className={`group relative overflow-hidden border-2 transition-all duration-300 bg-white rounded-xl hover:-translate-y-1 ${
        badge === "featured" 
          ? "border-yellow-400 shadow-lg hover:shadow-2xl" 
          : "border-gray-200 hover:border-primary shadow-md hover:shadow-xl"
      }`}>
        <div className="flex flex-row gap-6 p-4">
          {/* Product Image Container */}
          <div className="relative flex-shrink-0 w-40 h-40 rounded-lg">
            <img
              src={
                photos[0] ??
                "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
              }
              alt={product_name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />

            {/* Badge */}
            {badge && (
              <div className={`absolute top-2 right-2 ${badgeStyles[badge]} rounded-lg px-2 py-1 text-xs font-bold shadow-lg`}>
                {badgeLabels[badge]}
              </div>
            )}

            {/* Featured sparkle */}
            {badge === "featured" && (
              <div className="absolute top-2 left-2">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col flex-grow justify-between min-w-0">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {product_name}
              </h3>
              {model_number && (
                <p className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg inline-block">
                  {model_number}
                </p>
              )}
              {canViewQuantity && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${on_hand_qty > 10 ? 'bg-green-500' : on_hand_qty > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                  <p className="text-sm font-semibold text-gray-700">
                    {on_hand_qty > 0 ? `${on_hand_qty} in stock` : 'Out of stock'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleGetQuote}
                size="lg"
                className={`flex-1 h-11 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                  badge === "out of stock"
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                    : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white"
                } hover:scale-105 active:scale-95`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {badge === "out of stock" ? "Pre-Order" : "Get Quote"}
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
            product_name,
            model_number,
            photos,
          }}
        />
      </div>
    );
  }

  // Grid view layout (default) - Compact and clean
  return (
    <div className={`group relative overflow-hidden border-2 transition-all duration-300 bg-white rounded-xl hover:-translate-y-1 ${
      badge === "featured" 
        ? "border-yellow-400 shadow-lg hover:shadow-2xl" 
        : "border-gray-200 hover:border-primary shadow-md hover:shadow-xl"
    }`}>
      {/* Product Image Container */}
      <div className="relative aspect-square p-3">
        <img
          src={
            photos[0] ??
            "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
          }
          alt={product_name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />

        {/* Action Buttons - Always Visible */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Wishlist Button */}
          <WishlistButton product_id={id ?? ""} />

          {/* Badge */}
          {badge && (
            <div className={`${badgeStyles[badge]} rounded-lg px-2 py-1 text-xs font-bold shadow-lg`}>
              {badgeLabels[badge]}
            </div>
          )}
        </div>

        {/* View Button - Always Visible on Mobile, Center on Desktop Hover */}
        <div className="absolute bottom-2 right-2 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleViewProduct}
            className="h-10 w-10 md:h-14 md:w-14 rounded-full bg-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-gray-200 hover:border-primary"
          >
            <Eye className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </button>
        </div>

        {/* Featured sparkle */}
        {badge === "featured" && (
          <div className="absolute top-2 left-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem] mb-2">
          {product_name}
        </h3>
        
        {model_number && (
          <p className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-md inline-block mb-2">
            {model_number}
          </p>
        )}
        
        {canViewQuantity && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${on_hand_qty > 10 ? 'bg-green-500' : on_hand_qty > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <p className="text-xs font-semibold text-gray-700">
              {on_hand_qty > 0 ? `${on_hand_qty} in stock` : 'Out of stock'}
            </p>
          </div>
        )}

        {/* Get Quote Button */}
        <Button
          onClick={handleGetQuote}
          className={`w-full h-10 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
            badge === "out of stock"
              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
              : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white"
          } hover:scale-105 active:scale-95`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {badge === "out of stock" ? "Pre-Order" : "Get Quote"}
        </Button>
      </div>

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
    </div>
  );
};

export default ProductCard;
