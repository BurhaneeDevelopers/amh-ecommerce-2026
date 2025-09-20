"use client";

import { Quote, Package, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H1, H3, P } from "@/components/typography/typography";
import WishlistButton from "@/components/blocks/wishlist-button";
import { Product } from "@/supabase/schema/schema.type";

interface ProductInfoProps {
  product: Product;
  capacityInfo?: {
    id: string;
    capacity_name: string;
    slug: string;
  } | null;
  onGetQuote: () => void;
  isOutOfStock: boolean;
}

export default function ProductInfo({
  product,
  capacityInfo,
  onGetQuote,
  isOutOfStock,
}: ProductInfoProps) {
  return (
    <div className="space-y-8 w-full flex-grow">
      {/* Header */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <H1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.product_name}
            </H1>
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
          </div>
          <WishlistButton
            product_id={product.id || ""}
            className="w-fit left-10/12 !top-0"
          />
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Package className="w-6 h-6 mx-auto text-blue-600 mb-2" />
          <P className="text-sm font-medium text-gray-900">Quality Product</P>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Truck className="w-6 h-6 mx-auto text-green-600 mb-2" />
          <P className="text-sm font-medium text-gray-900">Fast Delivery</P>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Shield className="w-6 h-6 mx-auto text-purple-600 mb-2" />
          <P className="text-sm font-medium text-gray-900">Warranty</P>
        </div>
      </div>

      {/* Specifications */}
      {product.specifications && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <H3 className="text-xl font-semibold mb-4 text-gray-900">
            Specifications
          </H3>
          <div className="prose prose-sm max-w-none">
            <P className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.specifications}
            </P>
          </div>
        </div>
      )}

      {/* Capacity Info */}
      {capacityInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <H3 className="text-xl font-semibold mb-3 text-blue-900">Capacity</H3>
          <P className="text-lg font-medium text-blue-800">
            {capacityInfo.capacity_name}
          </P>
        </div>
      )}

      {/* Stock Status */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <H3 className="text-lg font-semibold text-gray-900 mb-1">
              Availability
            </H3>
            <P
              className={`text-sm font-medium ${
                product.on_hand_qty > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.on_hand_qty > 0
                ? `${product.on_hand_qty} units available`
                : "Currently out of stock"}
            </P>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              product.on_hand_qty > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-100">
        <Button
          onClick={onGetQuote}
          disabled={isOutOfStock}
          size="lg"
          className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-200 ${
            isOutOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          <Quote className="w-5 h-5 mr-3" />
          {isOutOfStock ? "Out of Stock" : "Get Quote"}
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
