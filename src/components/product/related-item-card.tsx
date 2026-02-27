'use client'

import { H3, P } from '@/components/typography/typography'
import { ImageIcon } from 'lucide-react'

interface RelatedItemCardProps {
  id: string
  name: string
  images: string[]
  category?: {
    id: string
    category_name: string
  }
  type: 'accessory' | 'spare'
}

export default function RelatedItemCard({ name, images, category, type }: RelatedItemCardProps) {
  const hasImages = images && images.length > 0
  const mainImage = hasImages ? images[0] : null
  const additionalImages = hasImages ? images.slice(1, 4) : []
  const remainingCount = hasImages ? Math.max(0, images.length - 4) : 0

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
      {/* Main Image */}
      <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2" />
            <P className="text-xs text-center px-2">No image available</P>
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="space-y-2">
        <H3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
          {name}
        </H3>
        
        {category && (
          <P className="text-xs text-gray-500 font-medium">
            {category.category_name}
          </P>
        )}

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            type === 'accessory' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {type === 'accessory' ? 'Accessory' : 'Spare Part'}
          </span>
        </div>

        {/* Additional Images Preview */}
        {additionalImages.length > 0 && (
          <div className="flex gap-1 mt-3">
            {additionalImages.map((img, idx) => (
              <div key={idx} className="w-8 h-8 rounded-md border border-gray-200 overflow-hidden bg-gray-50">
                <img
                  src={img}
                  alt={`${name} ${idx + 2}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="w-8 h-8 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                <P className="text-xs text-gray-600 font-medium">+{remainingCount}</P>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
