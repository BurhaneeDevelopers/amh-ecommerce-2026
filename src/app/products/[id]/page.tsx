'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import { useGetSingleProduct } from '@/api/products.service'
import { useGetAllAccessories } from '@/api/accessories.service'
import { useGetAllSpares } from '@/api/spares.service'
import { useGetAllCapacity } from '@/api/capacity.service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { H1, H2, H3, P } from '@/components/typography/typography'
import WishlistButton from '@/components/blocks/wishlist-button'
import { Container } from '@/components/layout/container'
import GetQuoteModal from '@/components/blocks/modal/get-quote-modal'

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useGetSingleProduct(productId)
  const { data: accessories = [] } = useGetAllAccessories()
  const { data: spares = [] } = useGetAllSpares()
  const { data: capacities = [] } = useGetAllCapacity()

  if (productLoading) {
    return (
      <Container className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (productError || !product) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <H2>Product not found</H2>
          <P className="mt-2">The product you&apos;re looking for doesn&apos;t exist.</P>
        </div>
      </Container>
    )
  }

  const productImages = product.photos && product.photos.length > 0 
    ? product.photos 
    : ["https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"]
  
  // For now, show all accessories and spares (you can filter later based on your data structure)
  // If you have specific relationships, update the filtering logic accordingly
  const productAccessories = product.accessories?.length 
    ? accessories.filter(acc => product.accessories?.includes(acc.id || ''))
    : accessories.slice(0, 4) // Show first 4 accessories as example
    
  const productSpares = product.spares?.length 
    ? spares.filter(spare => product.spares?.includes(spare.id || ''))
    : spares.slice(0, 4) // Show first 4 spares as example
    
  const productCapacity = capacities.find(cap => cap.id === product.capacity)

  // Debug logging (remove in production)
  console.log('Product accessories IDs:', product.accessories)
  console.log('Available accessories:', accessories.map(a => ({ id: a.id, name: a.accessory_name })))
  console.log('Filtered accessories:', productAccessories.map(a => ({ id: a.id, name: a.accessory_name })))
  console.log('Product spares IDs:', product.spares)
  console.log('Available spares:', spares.map(s => ({ id: s.id, name: s.spare_name })))
  console.log('Filtered spares:', productSpares.map(s => ({ id: s.id, name: s.spare_name })))

  const badge = !product.stock_status || product.on_hand_qty <= 0 
    ? "out of stock" 
    : product.is_on_sale 
    ? "on sale" 
    : product.is_featured 
    ? "featured" 
    : null

  const badgeStyles = {
    "on sale": "bg-red-500",
    "out of stock": "bg-gray-500",
    "featured": "bg-yellow-500 text-black",
  }

  const badgeLabels = {
    "on sale": "On Sale!",
    "out of stock": "Out of Stock",
    "featured": "Featured",
  }

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <P className="text-gray-500">
          <span className="hover:text-gray-700 cursor-pointer">Products</span> / {product.product_name}
        </P>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-gray-50">
            <Image
              src={productImages[selectedImageIndex] || "https://opencart.mahardhi.com/MT05/toolex/image/cache/catalog/products/9-266x266.jpg"}
              alt={product.product_name}
              fill
              className="object-contain p-4"
            />
            {badge && (
              <Badge className={`${badgeStyles[badge as keyof typeof badgeStyles]} absolute top-4 right-4`}>
                {badgeLabels[badge as keyof typeof badgeLabels]}
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 bg-gray-50 ${
                    selectedImageIndex === index ? 'border-amber-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.product_name} ${index + 1}`}
                    width={120}
                    height={120}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
          
          {/* Show single image indicator if only one image */}
          {productImages.length === 1 && (
            <div className="text-center">
              <P className="text-sm text-gray-500">1 of 1 image</P>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="relative">
            <H1 className="text-3xl font-bold">{product.product_name}</H1>
            {product.model_number && (
              <P className="text-gray-600 mt-2">Model: {product.model_number}</P>
            )}
            <div className="absolute top-0 right-0">
              <WishlistButton product_id={product.id || ''} />
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div>
              <H3 className="mb-3">Specifications</H3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <P className="whitespace-pre-wrap">{product.specifications}</P>
              </div>
            </div>
          )}

          {/* Capacity Info */}
          {productCapacity && (
            <div>
              <H3 className="mb-3">Capacity</H3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <P className="font-medium">{productCapacity.capacity_name}</P>
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div>
            <P className="text-sm text-gray-600">
              Stock: {product.on_hand_qty > 0 ? `${product.on_hand_qty} available` : 'Out of stock'}
            </P>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowQuoteModal(true)}
              disabled={badge === "out of stock"}
              className="flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80"
            >
              <Quote className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Accessories & Spares Section */}
      {(productAccessories.length > 0 || productSpares.length > 0) && (
        <div className="mt-12 space-y-8">
          {/* Accessories Section */}
          {productAccessories.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <H2 className="mb-6 text-2xl font-bold">Related Accessories</H2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productAccessories.map((accessory) => (
                  <div key={accessory.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={accessory.accessory_image[0] || "/placeholder.jpg"}
                        alt={accessory.accessory_name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <H3 className="text-sm font-medium mb-1">{accessory.accessory_name}</H3>
                    {accessory.category && (
                      <P className="text-xs text-gray-500">{accessory.category.category_name}</P>
                    )}
                    {/* Show additional images if available */}
                    {accessory.accessory_image.length > 1 && (
                      <div className="flex gap-1 mt-2">
                        {accessory.accessory_image.slice(1, 4).map((img, idx) => (
                          <div key={idx} className="w-8 h-8 rounded border overflow-hidden bg-gray-100">
                            <Image
                              src={img}
                              alt={`${accessory.accessory_name} ${idx + 2}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                        {accessory.accessory_image.length > 4 && (
                          <div className="w-8 h-8 rounded border bg-gray-200 flex items-center justify-center">
                            <P className="text-xs text-gray-600">+{accessory.accessory_image.length - 4}</P>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spares Section */}
          {productSpares.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6">
              <H2 className="mb-6 text-2xl font-bold">Spare Parts</H2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productSpares.map((spare) => (
                  <div key={spare.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={spare.spare_image[0] || "/placeholder.jpg"}
                        alt={spare.spare_name}
                        width={200}
                        height={200}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <H3 className="text-sm font-medium mb-1">{spare.spare_name}</H3>
                    {spare.category && (
                      <P className="text-xs text-gray-500">{spare.category.category_name}</P>
                    )}
                    {/* Show additional images if available */}
                    {spare.spare_image.length > 1 && (
                      <div className="flex gap-1 mt-2">
                        {spare.spare_image.slice(1, 4).map((img, idx) => (
                          <div key={idx} className="w-8 h-8 rounded border overflow-hidden bg-gray-100">
                            <Image
                              src={img}
                              alt={`${spare.spare_name} ${idx + 2}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                        {spare.spare_image.length > 4 && (
                          <div className="w-8 h-8 rounded border bg-gray-200 flex items-center justify-center">
                            <P className="text-xs text-gray-600">+{spare.spare_image.length - 4}</P>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Get Quote Modal */}
      <GetQuoteModal
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        product={product}
      />
    </Container>
  )
}
