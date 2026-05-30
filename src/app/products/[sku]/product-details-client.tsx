'use client'

import { useParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useGetProductBySku } from '@/api/products.service'
import { Container } from '@/components/layout/container'
import GetQuoteModal from '@/components/modals/get-quote-modal'
import EnquirySuccessModal from '@/components/blocks/modal/enquiry-success-modal'
import ProductSpecificationsTable from '@/components/product/product-specifications-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Download, Phone, Mail, Award } from 'lucide-react'
import Image from 'next/image'

export default function ProductDetailsClient() {
  const params = useParams()
  const productSku = params.sku as string
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedSpecification, setSelectedSpecification] = useState<{ 
    index: number; 
    cells: { label: string; value: string; unit: string | null }[] 
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description')

  // Fetch product data by SKU
  const { data: product, isLoading: productLoading, error: productError } = useGetProductBySku(productSku)

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

  const handleGetQuote = (specData?: { 
    index: number; 
    cells: { label: string; value: string; unit: string | null }[] 
  }) => {
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
    <div className="min-h-screen bg-slate-50">
      <Container className="py-8">
        {/* Product Header Section - Lead Generation Focused */}
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-10 mb-10">
          {/* Product Image - Clean Technical Presentation */}
          <div className="bg-white border-2 border-slate-200 rounded-lg p-10 flex items-center justify-center sticky top-8 h-fit">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={1000}
                height={1000}
                className="max-w-full h-[400px] w-[400px] object-contain"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="text-7xl text-slate-300 mb-3">{product.category?.icon || '📦'}</div>
                  <p className="text-slate-400 text-sm font-medium">Product Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Info - Conversion Optimized */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              {product.category && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {product.category.name}
                  </span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Description */}
              {product.description && (
                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              )}
            </div>

            {/* Quick Specs - Scannable Format */}
            {specificationSummary && specificationSummary.length > 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Key Specifications
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {specificationSummary.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-4 py-2 border-b border-slate-100 last:border-0">
                      <span className="font-semibold text-slate-900 min-w-[140px]">{spec.label}</span>
                      <span className="text-slate-700">{spec.values.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Section - Prominent Lead Generation */}
            <div className="bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] p-8 rounded-lg text-white">
              <h3 className="text-2xl font-bold mb-2">Request a Quote</h3>
              <p className="text-white/90 mb-6 text-lg">
                Get competitive pricing and availability for bulk orders. Our team responds within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleGetQuote()}
                  disabled={isOutOfStock}
                  size="lg"
                  className="bg-white text-[#ff6b35] hover:bg-white/80 px-8 h-14 text-lg font-bold shadow-lg flex-1"
                >
                  Get Quote Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white! hover:bg-white/10 px-8 h-14 text-lg font-bold bg-transparent"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Specs
                </Button>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919884369751" className="hover:underline font-medium">+91 98843 69751</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:info@amhat.com" className="hover:underline font-medium">info@amhat.com</a>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Award className="w-5 h-5 text-[#ff6b35]" />
                <span className="font-medium">ISO 9001:2015 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Award className="w-5 h-5 text-[#ff6b35]" />
                <span className="font-medium">Authorized Dealer</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Est. 1999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section - Clean Design */}
        <div className="mb-0">
          <div className="flex gap-0 border-b-2 border-slate-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold text-base transition-all relative ${
                activeTab === 'description'
                  ? 'text-[#ff6b35] bg-white'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Technical Details
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6b35]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`px-8 py-4 font-bold text-base transition-all relative ${
                activeTab === 'additional'
                  ? 'text-[#ff6b35] bg-white'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Additional Information
              {activeTab === 'additional' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ff6b35]" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content - Full Width for Table */}
        <div className="bg-white border-2 border-slate-200 border-t-0 mb-12 rounded-b-lg">
          {activeTab === 'description' && (
            <div className="space-y-0">
              {/* Description Text - Compact */}
              {product.description && (
                <div className="p-8 border-b-2 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Product Description</h3>
                  <p className="text-slate-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Specifications Table - FULL WIDTH, MAIN FOCUS */}
              {((product.product_master_values && product.product_master_values.length > 0) || 
                (product.product_variants && product.product_variants.length > 0)) && (
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Complete Technical Specifications</h3>
                  <ProductSpecificationsTable
                    product={product}
                    onGetQuote={handleGetQuote}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'additional' && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Additional Information</h3>
              <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
                <p>
                  This product is available through A.M. Hydraulics & Tubes, an ISO 9001:2015 and 
                  ISO 14001:2015 certified manufacturer and authorized distributor.
                </p>
                <p>
                  For bulk orders, custom specifications, or technical consultation, please contact 
                  our team for personalized assistance.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA - Conversion Reminder */}
        <div className="bg-slate-900 text-white p-10 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-3">Need This Product?</h3>
          <p className="text-slate-300 text-lg mb-6 max-w-2xl mx-auto">
            Request a quote for competitive pricing on single units or bulk orders. 
            Fast response, genuine products, ISO-certified quality.
          </p>
          <Button
            onClick={() => handleGetQuote()}
            disabled={isOutOfStock}
            size="lg"
            className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white px-10 h-14 text-lg font-bold"
          >
            Request Quote Now
          </Button>
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
    </div>
  )
}
