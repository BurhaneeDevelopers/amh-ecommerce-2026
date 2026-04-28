'use client'

import { useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useGetSingleProduct } from '@/api/products.service'
import { Container } from '@/components/layout/container'
import GetQuoteModal from '@/components/modals/get-quote-modal'
import EnquirySuccessModal from '@/components/blocks/modal/enquiry-success-modal'
import ProductSpecificationsTable from '@/components/product/product-specifications-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import Image from 'next/image'

export default function ProductDetailsPage() {
  const params = useParams()
  const productId = params.id as string
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedSpecification, setSelectedSpecification] = useState<{ index: number; cells: { label: string; value: string; unit: string | null }[] } | null>(null)
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description')

  // Fetch product data
  const { data: product, isLoading: productLoading, error: productError } = useGetSingleProduct(productId)

  // Extract specification summary for display
  const specificationSummary = useMemo(() => {
    if (!product?.product_master_values) return null;
    
    const summary: { label: string; values: string[] }[] = [];
    const masterMap = new Map<string, { label: string; values: Set<string> }>();

    product.product_master_values.forEach((pmv) => {
      const masterValue = pmv.master_values;
      if (!masterValue?.master_fields?.masters) return;

      const master = masterValue.master_fields.masters;
      const masterId = master.id!;
      const label = masterValue.master_fields.label;
      const value = masterValue.value;
      const unit = masterValue.master_fields.unit;

      if (!masterMap.has(masterId)) {
        masterMap.set(masterId, { label, values: new Set() });
      }
      
      const displayValue = unit ? `${value} ${unit}` : value;
      masterMap.get(masterId)!.values.add(displayValue);
    });

    masterMap.forEach((data) => {
      summary.push({
        label: data.label,
        values: Array.from(data.values)
      });
    });

    return summary;
  }, [product]);

  const handleGetQuote = (specData?: { index: number; cells: { label: string; value: string; unit: string | null }[] }) => {
    setSelectedSpecification(specData || null);
    setShowQuoteModal(true);
  };

  if (productLoading) {
    return (
      <Container className="py-8 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (productError || !product) {
    return (
      <Container className="py-8 max-w-7xl">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Container>
    )
  }

  const isOutOfStock = product?.status !== 'active'

  return (
    <Container className="py-8 max-w-7xl">
      {/* Product Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 mb-8">
        {/* Product Image - Technical Diagram Style */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={350}
              height={350}
              className="max-w-full h-auto"
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl text-gray-300 mb-2">{product.category?.icon || '📦'}</div>
                <p className="text-gray-400 text-sm">Technical Diagram</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>
            )}
          </div>

          {/* Specifications Summary */}
          {specificationSummary && specificationSummary.length > 0 && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              {/* Category */}
              {product.category && (
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="text-blue-600 text-xl">▶</span>
                    <span className="font-semibold text-gray-900">Category</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-700">: {product.category.name}</span>
                  </div>
                </div>
              )}

              {/* Dynamic Specifications */}
              {specificationSummary.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="text-blue-600 text-xl">▶</span>
                    <span className="font-semibold text-gray-900">{spec.label}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-700">: {spec.values.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => handleGetQuote()}
              disabled={isOutOfStock}
              size="lg"
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 h-12 text-base font-semibold uppercase"
            >
              Get a Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 h-12 text-base font-semibold uppercase"
            >
              <Download className="w-5 h-5 mr-2" />
              Brochure
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-0">
        <div className="flex gap-0 border-b-0">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'description'
                ? 'bg-cyan-400 text-gray-900'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('additional')}
            className={`px-8 py-3 font-medium transition-colors ${
              activeTab === 'additional'
                ? 'bg-cyan-400 text-gray-900'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Additional Information
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 p-8 mb-12">
        {activeTab === 'description' && (
          <div className="space-y-8">
            {/* Description Text */}
            {product.description && (
              <div className="prose prose-base max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications Table */}
            {product.product_master_values && product.product_master_values.length > 0 && (
              <div>
                <ProductSpecificationsTable
                  product={product}
                  onGetQuote={handleGetQuote}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'additional' && (
          <div className="prose prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Additional product information and technical details will be displayed here.
            </p>
          </div>
        )}
      </div>

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
          setShowSuccessModal(false);
        }}
      />
    </Container>
  )
}
