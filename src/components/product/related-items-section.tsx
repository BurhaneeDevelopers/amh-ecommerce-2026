'use client'

import { H2 } from '@/components/typography/typography'
import RelatedItemCard from './related-item-card'
import { Accessories, Spares } from '@/supabase/schema/schema.type'

interface RelatedItemsSectionProps {
  accessories: Accessories[]
  spares: Spares[]
}

export default function RelatedItemsSection({ accessories, spares }: RelatedItemsSectionProps) {
  const hasAccessories = accessories.length > 0
  const hasSpares = spares.length > 0

  if (!hasAccessories && !hasSpares) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Accessories Section */}
      {hasAccessories && (
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="mb-4">
            <H2 className="text-xl lg:text-2xl font-bold text-blue-900 mb-1">
              Related Accessories
            </H2>
            <p className="text-sm text-blue-700">
              Enhance your experience with these compatible accessories
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {accessories.map((accessory) => (
              <RelatedItemCard
                key={accessory.id}
                id={accessory.id || ''}
                name={accessory.accessory_name}
                images={accessory.accessory_image || []}
                category={accessory.category}
                type="accessory"
              />
            ))}
          </div>
        </section>
      )}

      {/* Spares Section */}
      {hasSpares && (
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <div className="mb-4">
            <H2 className="text-xl lg:text-2xl font-bold text-green-900 mb-1">
              Spare Parts
            </H2>
            <p className="text-sm text-green-700">
              Keep your equipment running with genuine spare parts
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {spares.map((spare) => (
              <RelatedItemCard
                key={spare.id}
                id={spare.id || ''}
                name={spare.spare_name}
                images={spare.spare_image || []}
                category={spare.category}
                type="spare"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
