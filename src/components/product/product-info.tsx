"use client";

import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { H1, H3, P } from "@/components/typography/typography";
import WishlistButton from "@/components/blocks/wishlist-button";
import { Product } from "@/supabase/schema/schema.type";
import { useState } from "react";
import { Input } from "../ui/input";
import { useAtom } from "jotai";
import { productQuantityAtom } from "@/jotai/store";

interface ProductInfoProps {
  product: Product;
  onGetQuote: () => void;
  isOutOfStock: boolean;
}

export default function ProductInfo({
  product,
  onGetQuote,
  isOutOfStock,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useAtom(productQuantityAtom);
  const [showMasterValues, setShowMasterValues] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  // Extract master values for display
  const specs = (product.product_master_values || []).map(pmv => ({
    id: pmv.id,
    label: pmv.master_values?.master_fields?.label || "Spec",
    value: pmv.master_values?.value || "",
    unit: pmv.master_values?.master_fields?.unit || "",
    icon: pmv.master_values?.master_fields?.masters?.icon || "🔹"
  }));

  return (
    <div className="space-y-8 w-full flex-grow">
      {/* Header */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <H1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight !font-montserrat">
                {product.name}
              </H1>
            </div>
            {product.sku && (
              <P className="text-lg text-gray-600 mt-2 font-medium">
                SKU: {product.sku}
              </P>
            )}
            {product.category && (
              <P className="text-sm text-gray-500 mt-1">
                Category: {product.category.name}
              </P>
            )}
            {product.status && (
              <div className="mt-3 inline-block">
                <div className={`border rounded-lg px-4 py-2 ${
                  product.status === 'active' 
                    ? 'bg-green-50 border-green-200' 
                    : product.status === 'draft'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <P className={`text-sm font-semibold ${
                    product.status === 'active' 
                      ? 'text-green-900' 
                      : product.status === 'draft'
                      ? 'text-yellow-900'
                      : 'text-gray-900'
                  }`}>
                    Status: <span className={
                      product.status === 'active' 
                        ? 'text-green-600' 
                        : product.status === 'draft'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }>{product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                  </P>
                </div>
              </div>
            )}
          </div>
          <WishlistButton
            product_id={product.id || ""}
            className="w-fit left-10/12 !top-0"
          />
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="bg-gray-50 rounded-lg p-4">
          <H3 className="text-sm font-semibold mb-2 text-gray-900">
            Description
          </H3>
          <P className="text-sm text-gray-700">
            {product.description}
          </P>
        </div>
      )}

      {/* Master Values / Specifications */}
      {specs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <button
            onClick={() => setShowMasterValues(!showMasterValues)}
            className="flex items-center justify-between w-full text-left"
          >
            <H3 className="text-lg font-semibold text-gray-900">
              Specifications
            </H3>
            {showMasterValues ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {showMasterValues && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div key={spec.id} className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 transition-colors hover:bg-blue-50">
                  <div className="text-2xl">{spec.icon}</div>
                  <div>
                    <P className="text-xs font-semibold text-blue-900/70 mb-0.5 uppercase tracking-wider">
                      {spec.label}
                    </P>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-bold text-blue-900">
                        {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            : `Get Quote (${quantity} unit${quantity > 1 ? "s" : ""})`}
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
