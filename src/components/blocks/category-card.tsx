'use client'

import Link from 'next/link'
import { Category } from '@/supabase/schema/schema.type'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CategoryCardProps extends Category {
  product_count?: number
}

export default function CategoryCard({
  id,
  name,
  description,
  color,
  product_count = 0,
}: CategoryCardProps) {
  const accent = color || '#f97316'

  return (
    <Link href={`/category/${id}`}>
      <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-2 hover:border-primary">
        {/* Image Section */}
        <div
          className="relative h-52 w-full overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: `${accent}12` }}
        >
          {/* Consistent SVG category icon */}
          <div className="group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 96 96"
              className="w-20 h-20"
            >
              <rect width="96" height="96" rx="20" fill={`${accent}22`} />
              <rect x="26" y="36" width="44" height="34" rx="5" fill={accent} opacity="0.72" />
              <rect x="34" y="26" width="28" height="14" rx="4" fill={accent} opacity="0.95" />
              <rect x="38" y="48" width="20" height="14" rx="3" fill="white" opacity="0.55" />
            </svg>
          </div>

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Shine sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Decorative Corner Element */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Animated Background for Content */}
        <div className="absolute inset-0 top-52 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative p-6 flex flex-col bg-white">
          {/* Category Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

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
      </Card>
    </Link>
  )
}
