'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useGetSingleProduct, useGetProductAccessories, useGetProductSpares } from '@/api/products.service'
import { useGetSingleCapacity } from '@/api/capacity.service'
import { Container } from '@/components/layout/container'
import GetQuoteModal from '@/components/modals/get-quote-modal'
import EnquirySuccessModal from '@/components/blocks/modal/enquiry-success-modal'
import ProductImageGallery from '@/components/product/product-image-gallery'
import ProductInfo from '@/components/product/product-info'
import RelatedItemsSection from '@/components/product/related-items-section'
import Breadcrumb from '@/components/product/breadcrumb'

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useGetSingleProduct(productId)
  
  // Fetch linked accessories and spares based on product data
  const { data: productAccessories = [] } = useGetProductAccessories(product?.accessories || [])
  const { data: productSpares = [] } = useGetProductSpares(product?.spares || [])
  const { data: productCapacity } = useGetSingleCapacity(product?.capacity || null)

  if (productLoading) {
    return (
      <Container className="py-8 lg:py-12">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-14 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (productError || !product) {
    return (
      <Container className="py-8 lg:py-12">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Container>
    )
  }

  // Prepare data for components
  const capacityInfo = product?.capacity_data || (
    productCapacity?.id ? {
      id: productCapacity.id,
      capacity_name: productCapacity.capacity_name,
      slug: productCapacity.slug
    } : null
  )
  const isOutOfStock = !product.stock_status || product.on_hand_qty <= 0
  
  const badge = isOutOfStock
    ? { type: 'out of stock' as const, label: 'Out of Stock', className: 'bg-gray-500 text-white' }
    : product.is_on_sale 
    ? { type: 'on sale' as const, label: 'On Sale!', className: 'bg-red-500 text-white' }
    : product.is_featured 
    ? { type: 'featured' as const, label: 'Featured', className: 'bg-yellow-500 text-black' }
    : null

  return (
    <Container className="">
      {/* Breadcrumb */}
      <Breadcrumb 
        productName={product.product_name}
        categoryName={product.category?.category_name}
      />

      {/* Main Product Section */}
      <div className="flex flex-wrap w-full 2xl:flex-nowrap gap-12 lg:gap-16 mb-16">
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.photos || []}
          productName={product.product_name}
          badge={badge}
        />

        {/* Product Info */}
        <ProductInfo
          product={product}
          capacityInfo={capacityInfo}
          onGetQuote={() => setShowQuoteModal(true)}
          isOutOfStock={isOutOfStock}
        />
      </div>

      {/* Related Items Section */}
      <RelatedItemsSection
        accessories={productAccessories}
        spares={productSpares}
      />

      {/* Get Quote Modal */}
      <GetQuoteModal
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        product={product}
        onSuccess={() => setShowSuccessModal(true)}
      />
      
      {/* Success Modal */}
      <EnquirySuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        onContinueShopping={() => {
          // You can add navigation logic here if needed
          // For now, just close the modal
        }}
      />
    </Container>
  )
}
