"use client";

import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H1, H3, P } from "@/components/typography/typography";
import WishlistButton from "@/components/blocks/wishlist-button";
import { Product, Accessories, Spares } from "@/supabase/schema/schema.type";
import { useState } from "react";
import { Input } from "../ui/input";
import { useAtom } from "jotai";
import { productQuantityAtom } from "@/jotai/store";
import { useCanViewQuantity } from "@/hooks/useCanViewQuantity";

interface ProductInfoProps {
  product: Product;
  capacityInfo?: {
    id: string;
    capacity_name: string;
    slug: string;
  } | null;
  onGetQuote: () => void;
  isOutOfStock: boolean;
  accessories?: Accessories[];
  spares?: Spares[];
}

export default function ProductInfo({
  product,
  capacityInfo,
  onGetQuote,
  isOutOfStock,
  accessories = [],
  spares = [],
}: ProductInfoProps) {
  const [quantity, setQuantity] = useAtom(productQuantityAtom);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const canViewQuantity = useCanViewQuantity();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input while typing
    if (value === "") {
      setQuantity(0);
      return;
    }
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setQuantity(numValue);
    }
  };

  const handleInputBlur = () => {
    // If quantity is 0 or invalid, reset to 1
    if (quantity < 1) {
      setQuantity(1);
    }
  };
  return (
    <div className="space-y-8 w-full flex-grow">
      {/* Header */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <H1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight !font-montserrat">
                {product.product_name}
              </H1>
            </div>
            {product.model_number && (
              <P className="text-lg text-gray-600 mt-2 font-medium">
                Model: {product.model_number}
              </P>
            )}
            {product.brand && (
              <P className="text-sm text-gray-500 mt-1">
                by {product.brand.brand_name}
              </P>
            )}
            {canViewQuantity && (
              <div className="mt-3 inline-block">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <P className="text-sm font-semibold text-blue-900">
                    Available Stock: <span className="text-blue-600">{product.on_hand_qty}</span> units
                  </P>
                </div>
              </div>
            )}
            {product.pcs_per_crtn && (
              <div className="mt-4">
                <P className="font-bold text-zinc-900">
                  {product.pcs_per_crtn} pieces per carton
                </P>
              </div>
            )}
          </div>
          <WishlistButton
            product_id={product.id || ""}
            className="w-fit left-10/12 !top-0"
          />
        </div>
      </div>

      {/* Compact Specifications and Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <H3 className="text-sm font-semibold mb-2 text-gray-900">
              Specifications
            </H3>
            <div className="space-y-1">
              {product.specifications.slice(0, 3).map((spec, index) => (
                <P key={index} className="text-xs text-gray-700">
                  • {spec}
                </P>
              ))}
              {product.specifications.length > 3 && (
                <P className="text-xs text-gray-500 italic">
                  +{product.specifications.length - 3} more...
                </P>
              )}
            </div>
          </div>
        )}
        {capacityInfo && (
          <div className="bg-blue-50 rounded-lg p-4">
            <H3 className="text-sm font-semibold mb-2 text-blue-900">
              Capacity
            </H3>
            <P className="text-xs text-blue-800">
              {capacityInfo.capacity_name}
            </P>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <H3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</H3>
        <div className="mb-3">
          <Input
            type="number"
            value={quantity === 0 ? '' : quantity}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min="1"
            placeholder="Enter quantity"
            className={`w-32 px-4 py-2 text-center border rounded-lg focus:!outline-none focus:!ring-2 ${
              quantity < 1 
                ? 'border-red-300 focus:!ring-red-500' 
                : 'border-gray-300 focus:!ring-blue-500'
            }`}
          />
          {quantity < 1 && (
            <p className="text-xs text-red-600 mt-2">Quantity must be at least 1</p>
          )}
        </div>
        <P className="text-sm text-gray-600">
          We only accept bulk orders
        </P>
      </div>

      {/* Additional Information */}
      {(accessories.length > 0 || spares.length > 0) && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <button
            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
            className="flex items-center justify-between w-full text-left"
          >
            <H3 className="text-lg font-semibold text-gray-900">
              Additional Information
            </H3>
            {showAdditionalInfo ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showAdditionalInfo && (
            <div className="mt-4">
              <div className="space-y-6">
                {accessories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Accessories
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {accessories.slice(0, 6).map((accessory) => (
                        <div
                          key={accessory.id}
                          className="text-xs p-2 bg-blue-50 rounded-lg"
                        >
                          <p className="font-medium text-blue-900 truncate">
                            {accessory.accessory_name}
                          </p>
                          {accessory.category && (
                            <p className="text-blue-700 truncate">
                              {accessory.category.category_name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {spares.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Spare Parts
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {spares.slice(0, 6).map((spare) => (
                        <div
                          key={spare.id}
                          className="text-xs p-2 bg-green-50 rounded-lg"
                        >
                          <p className="font-medium text-green-900 truncate">
                            {spare.spare_name}
                          </p>
                          {spare.category && (
                            <p className="text-green-700 truncate">
                              {spare.category.category_name}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-100">
        <Button
          onClick={onGetQuote}
          disabled={isOutOfStock || quantity < 1}
          size="lg"
          className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-200 ${
            isOutOfStock || quantity < 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          <Quote className="w-5 h-5" />
          {isOutOfStock
            ? "Out of Stock"
            : quantity < 1
            ? "Enter Quantity"
            : `Get Quote (${quantity} carton${quantity > 1 ? "s" : ""})`}
        </Button>
        {!isOutOfStock && (
          <P className="text-center text-sm text-gray-500 mt-3">
            Get personalized pricing and availability
          </P>
        )}
      </div>
    </div>
  );
}
