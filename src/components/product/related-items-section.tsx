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
    <div className="space-y-12">
      {/* Accessories Section */}
      {hasAccessories && (
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="mb-8">
            <H2 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
              Related Accessories
            </H2>
            <p className="text-blue-700">
              Enhance your experience with these compatible accessories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="mb-8">
            <H2 className="text-2xl lg:text-3xl font-bold text-green-900 mb-2">
              Spare Parts
            </H2>
            <p className="text-green-700">
              Keep your equipment running with genuine spare parts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
