'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { P } from '@/components/typography/typography'

interface BreadcrumbProps {
  productName: string
  categoryName?: string
}

export default function Breadcrumb({ productName, categoryName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-8">
      <Link 
        href="/" 
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <Link 
        href="/products" 
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        Products
      </Link>
      
      {categoryName && (
        <>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">{categoryName}</span>
        </>
      )}
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <P className="text-gray-900 font-medium truncate max-w-xs">
        {productName}
      </P>
    </nav>
  )
}
