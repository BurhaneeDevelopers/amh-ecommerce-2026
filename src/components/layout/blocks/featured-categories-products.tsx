'use client'

import { useGetFeaturedMainCategories } from '@/api/category.service'
import { Loader2 } from 'lucide-react'
import CategoryProductsSection from './category-products-section'
import { Container } from '../container'

const FeaturedCategoriesProducts = () => {
    const { data: featuredCategories = [], isLoading } = useGetFeaturedMainCategories()

    if (isLoading) {
        return (
            <Container className='!px-0'>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Container>
        )
    }

    if (featuredCategories.length === 0) {
        return null
    }

    return (
        <div className="space-y-12">
            {featuredCategories.map((category) => (
                <CategoryProductsSection key={category.id} category={category} />
            ))}
        </div>
    )
}

export default FeaturedCategoriesProducts
