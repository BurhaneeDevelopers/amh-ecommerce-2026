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

const ProductCard: React.FC<Product> = ({
  id,
  product_name,
  model_number,
  photos,
  on_hand_qty,
  is_on_sale,
  stock_status,
}) => {
  const router = useRouter();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Determine badge based on product properties
  const badge: BadgeVariant =
    !stock_status || on_hand_qty <= 0
      ? "out of stock"
      : is_on_sale
      ? "on sale"
      : "featured";

  const handleViewProduct = () => {
    if (id) {
      router.push(`/products/${id}`);
    }
  };
  const handleGetQuote = () => {
    setIsQuoteModalOpen(true);
  };

  return (
    <Card className={`group relative overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 bg-white rounded-xl flex flex-col ${
      badge === "featured" 
        ? "border-2 border-yellow-400 shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_35px_rgba(251,191,36,0.5)]" 
        : "border-gray-200"
    }`}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Product Image Container - Fixed aspect ratio */}
        <div className="relative overflow-hidden bg-white aspect-square flex-shrink-0 border-b border-gray-100">
          <Image
            width={500}
            height={500}
            src={
              photos[0] ??
              "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
            }
            alt={product_name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Action Buttons - Always Visible */}
          <WishlistButton product_id={id ?? ""} />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <button
              onClick={handleViewProduct}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Badge */}
          {badge && (
            <Badge
              className={`absolute top-2 right-2 ${badgeStyles[badge]} border-0 shadow-md font-medium px-2 py-1 text-[9px] ${badge === "featured" ? "font-bold" : ""}`}
            >
              {badgeLabels[badge]}
            </Badge>
          )}
        </div>

        {/* Product Info - Flexible height with proper spacing */}
        <div className="flex flex-col flex-grow p-3 sm:p-4 justify-between min-h-[120px]">
          <div className="space-y-1 flex-grow">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product_name}
            </h3>
            {model_number && (
              <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
                {model_number}
              </p>
            )}
          </div>

          {/* Get Quote Button - Responsive */}
          <Button
            onClick={handleGetQuote}
            disabled={badge === "out of stock"}
            size="sm"
            className={`w-full mt-3 h-9 sm:h-10 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
              badge === "out of stock"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {badge === "out of stock" ? "Unavailable" : "Get Quote"}
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
