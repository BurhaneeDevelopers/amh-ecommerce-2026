'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Zap } from 'lucide-react'

export default function MobileDeals() {
    const deals = [
        {
            title: "Flash Sale",
            description: "Up to 50% off power tools",
            icon: <Zap className="w-5 h-5" />,
            color: "bg-red-500"
        },
        {
            title: "Deal of the Day",
            description: "Limited time offers",
            icon: <Clock className="w-5 h-5" />,
            color: "bg-blue-500"
        },
        {
            title: "Best Sellers",
            description: "Top rated products",
            icon: <Star className="w-5 h-5" />,
            color: "bg-green-500"
        }
    ]

    return (
        <div className="w-full">
            <h3 className="font-semibold text-lg mb-3 px-1">Special Offers</h3>
            <div className="grid grid-cols-1 gap-3">
                {deals.map((deal, index) => (
                    <Card key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${deal.color} text-white`}>
                                {deal.icon}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900">{deal.title}</div>
                                <div className="text-sm text-gray-600">{deal.description}</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                View
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
