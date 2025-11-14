'use client'

import { H3, H5, P } from '@/components/typography/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import { useGetTopAdByPlacement } from '@/api/ads.service'
import { Sparkles } from 'lucide-react'

const FeaturedDeal: React.FC = () => {
    const { data: ad, isLoading } = useGetTopAdByPlacement('featured_deal')

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-white shadow-sm p-1 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-64 bg-gray-100 rounded-lg"></div>
            </div>
        )
    }

    if (!ad) {
        return null; // Don't render if no ad available
    }

    return (
        <div className="rounded-xl border bg-white shadow-sm p-1 hover:shadow-lg transition-shadow duration-300">
            <H5 className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg text-center uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Featured Deal
            </H5>
            <div className="flex flex-col justify-center items-center relative p-2">
                <div className="relative w-full aspect-square max-w-[280px] mb-3">
                    <Image
                        width={500}
                        height={500}
                        src={ad.media_url}
                        alt={ad.title}
                        className="w-full h-full object-contain rounded-lg"
                    />
                    <Badge className='bg-red-600 text-white absolute top-2 right-2 text-xs font-bold shadow-lg animate-pulse'>
                        HOT DEAL
                    </Badge>
                </div>
                
                <div className='flex flex-col gap-2 w-full px-2'>
                    <H3 className="font-semibold text-center text-gray-900 line-clamp-2">
                        {ad.title}
                    </H3>
                    {ad.description && (
                        <P className="text-sm text-gray-600 text-center line-clamp-2">
                            {ad.description}
                        </P>
                    )}
                </div>

                <div className="p-2 w-full pb-2">
                    {ad.click_url ? (
                        <a href={ad.click_url} target="_blank" rel="noopener noreferrer">
                            <Button className='bg-gradient-to-r from-orange-500 to-red-500 font-bold text-white hover:from-orange-600 hover:to-red-600 w-full shadow-md hover:shadow-lg transition-all duration-300'>
                                Get This Deal
                            </Button>
                        </a>
                    ) : (
                        <Button className='bg-gradient-to-r from-orange-500 to-red-500 font-bold text-white w-full shadow-md' disabled>
                            Coming Soon
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FeaturedDeal
