import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import WishlistButton from "./wishlist-button";
import { H4, P } from "../typography/typography";
import { Button } from "../ui/button";

// Define badge variants
type BadgeVariant = "sale" | "out_of_stock" | "featured" | null;

export interface Product {
    id: string;
    title: string;
    model?: string;
    image: string;
    badge?: BadgeVariant;
}

interface ProductCardProps extends Product {
    onShopNow?: (productId: string) => void;
}

const badgeStyles: Record<Exclude<BadgeVariant, null>, string> = {
    sale: "bg-red-500",
    out_of_stock: "bg-gray-500",
    featured: "bg-yellow-500 text-black",
};

const badgeLabels: Record<Exclude<BadgeVariant, null>, string> = {
    sale: "On Sale!",
    out_of_stock: "Out of Stock",
    featured: "Featured",
};

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    title,
    model,
    image,
    badge = null,
    onShopNow,
}) => {
    return (
        <div className="flex flex-col justify-center items-center relative border border-gray-300 rounded-2xl p-1.5">
            <div className="relative w-fit h-fit overflow-hidden !rounded-lg shadow-lg mb-2 border-b">
                <Image
                    width={500}
                    height={500}
                    src={image}
                    alt={title}
                    className="w-fit h-full object-cover"
                />

                <div className="bg-black/30 absolute inset-0 w-full h-full" />
            </div>

            {/* Badge */}
            {badge && (
                <Badge
                    className={`${badgeStyles[badge]} absolute top-3 right-3`}
                >
                    {badgeLabels[badge]}
                </Badge>
            )}

            {/* Wishlist */}
            <WishlistButton />

            {/* Product Info */}
            <div className="flex flex-col gap-1 mt-2">
                <H4 className="font-medium text-center">{title}</H4>
                {model && (
                    <P className="text-sm text-gray-500 text-center">Model: {model}</P>
                )}
            </div>

            {/* Button */}
            <div className="p-2 w-full pb-4">
                <Button
                    onClick={() => onShopNow?.(id)}
                    disabled={badge === "out_of_stock"}
                    className={`bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80 w-full ${badge === "out_of_stock" ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <P>{badge === "out_of_stock" ? "Unavailable" : "Get Quote"}</P>
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
