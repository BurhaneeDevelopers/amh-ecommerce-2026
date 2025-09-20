import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import WishlistButton from "./wishlist-button";
import { H4, P } from "../typography/typography";
import { Button } from "../ui/button";
import { Product } from "@/supabase/schema/schema.type";

// Define badge variants based on `tag`
type BadgeVariant = "on sale" | "out of stock" | "featured" | null;

const badgeStyles: Record<Exclude<BadgeVariant, null>, string> = {
  "on sale": "bg-red-500",
  "out of stock": "bg-gray-500",
  featured: "bg-yellow-500 text-black",
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
  
  // Determine badge based on product properties
  const badge: BadgeVariant = !stock_status || on_hand_qty <= 0 
    ? "out of stock" 
    : is_on_sale 
    ? "on sale" 
    : "featured";

  const handleViewProduct = () => {
    if (id) {
      router.push(`/products/${id}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center relative border border-gray-300 rounded-2xl p-1.5 w-64">
      {/* Product Image */}
      <div className="relative w-full h-fit overflow-hidden !rounded-lg shadow-lg mb-2 border-b">
        <Image
          width={500}
          height={500}
          src={
            photos[0] ??
            "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"
          }
          alt={product_name}
          className="w-full h-full object-cover"
        />
        <div className="bg-black/30 absolute inset-0 w-full h-full" />
      </div>

      {/* Badge */}
      {badge && (
        <Badge className={`${badgeStyles[badge]} absolute top-3 right-3`}>
          {badgeLabels[badge]}
        </Badge>
      )}

      {/* Wishlist */}
      <WishlistButton product_id={id ?? ""} />

      {/* Product Info */}
      <div className="flex flex-col gap-1 mt-2">
        <H4 className="font-medium text-center">{product_name}</H4>
        {model_number && (
          <P className="text-sm text-gray-500 text-center">
            Model: {model_number}
          </P>
        )}
      </div>

      {/* Button */}
      <div className="p-2 w-full pb-4">
        <Button
          onClick={handleViewProduct}
          disabled={badge === "out of stock"}
          className={`bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80 w-full ${
            badge === "out of stock"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <P>
            {badge === "out of stock"
              ? "Unavailable"
              : "View Product"}
          </P>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
