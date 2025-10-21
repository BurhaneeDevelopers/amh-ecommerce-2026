'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Zap } from 'lucide-react'
import { useGetAdsByPlacement } from '@/api/ads.service'

export default function MobileDeals() {
    const { data: ads = [] } = useGetAdsByPlacement('mobile_deals');
    
    // Fallback deals if no ads are available
    const fallbackDeals = [
        {
            title: "Flash Sale",
            description: "Up to 50% off power tools",
            icon: <Zap key="zap" className="w-5 h-5" />,
            color: "bg-red-500",
            clickUrl: null
        },
        {
            title: "Deal of the Day",
            description: "Limited time offers",
            icon: <Clock key="clock" className="w-5 h-5" />,
            color: "bg-blue-500",
            clickUrl: null
        },
        {
            title: "Best Sellers",
            description: "Top rated products",
            icon: <Star key="star" className="w-5 h-5" />,
            color: "bg-green-500",
            clickUrl: null
        }
    ];

    // Use ads if available, otherwise use fallback
    const deals = ads.length > 0 
        ? ads.slice(0, 3).map((ad, index) => ({
            title: ad.title,
            description: ad.description || "Special offer",
            icon: [<Zap key="zap" className="w-5 h-5" />, <Clock key="clock" className="w-5 h-5" />, <Star key="star" className="w-5 h-5" />][index % 3],
            color: ["bg-red-500", "bg-blue-500", "bg-green-500"][index % 3],
            clickUrl: ad.click_url
        }))
        : fallbackDeals;

    return (
        <div className="w-full">
            <h3 className="font-semibold text-lg mb-3 px-1">Special Offers</h3>
            <div className="grid grid-cols-1 gap-3">
                {deals.map((deal, index) => {
                    const content = (
                        <Card className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
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
                    );

                    if (deal.clickUrl) {
                        return (
                            <a key={index} href={deal.clickUrl} target="_blank" rel="noopener noreferrer">
                                {content}
                            </a>
                        );
                    }

                    return <div key={index}>{content}</div>;
                })}
            </div>
        </div>
    )
}
