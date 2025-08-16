'use client'

import { H5 } from '@/components/typography/typography'
import Image from 'next/image'
import React from 'react'

type Product = {
    id: string
    name: string
    imageUrl: string
    modelNumber: string
}

const bestSellers: Product[] = [
    {
        id: '1',
        name: 'Carbide Saw',
        imageUrl: 'https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg',
        modelNumber: 'CS-2025'
    },
    {
        id: '2',
        name: 'Power Drill',
        imageUrl: 'https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg',
        modelNumber: 'PD-1500'
    },
    {
        id: '3',
        name: 'Bandsaw',
        imageUrl: 'https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg',
        modelNumber: 'BS-3100'
    },
    {
        id: '4',
        name: 'Circular Saw',
        imageUrl: 'https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg',
        modelNumber: 'CS-500X'
    }
]

const BestSellerShowcase: React.FC = () => {
    return (
        <div className="rounded-xl border bg-white shadow-sm p-1">
            <H5 className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold px-4 py-2 rounded-lg text-center">
                Bestseller Products
            </H5>
            <ul className="divide-y">
                {bestSellers.map((product) => (
                    <li key={product.id} className="flex gap-4 items-center p-3">
                        <Image
                            width={500}
                            height={500}
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-20 h-16 object-cover !rounded-lg"
                        />
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">Model: {product.modelNumber}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BestSellerShowcase
