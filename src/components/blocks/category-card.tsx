'use client'

import Link from 'next/link'
import { Category } from '@/supabase/schema/schema.type'
import { ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CategoryCardProps extends Category {
  product_count?: number
}

export default function CategoryCard({ 
  id, 
  category_name, 
  icon,
  product_count = 0,
  is_featured 
}: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`}>
      <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 hover:border-primary">
        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 shadow-lg animate-pulse">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15">
          {icon ? (
            <>
              <img
                src={icon}
                alt={category_name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
              />
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Package className="w-24 h-24 text-primary/40 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
            </div>
          )}
          
          {/* Decorative Corner Element */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Animated Background for Content */}
        <div className="absolute inset-0 top-52 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative p-6 flex flex-col bg-white">
          {/* Category Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
            {category_name}
          </h3>

          {/* Product Count & CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 group-hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                {product_count}
              </span>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                {product_count === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {/* Arrow Icon with Animation */}
            <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-all duration-300 group-hover:shadow-lg">
              <ArrowRight className="w-5 h-5 text-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </Card>
    </Link>
  )
}
