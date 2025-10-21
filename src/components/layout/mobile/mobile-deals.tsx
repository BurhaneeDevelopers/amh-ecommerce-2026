'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Star, Zap, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useGetAdsByPlacement } from '@/api/ads.service'
import { motion } from 'framer-motion'

export default function MobileDeals() {
    const { data: ads = [], isLoading } = useGetAdsByPlacement('mobile_deals');
    
    // Fallback deals if no ads are available
    const fallbackDeals = [
        {
            title: "Flash Sale",
            description: "Up to 50% off power tools",
            icon: <Zap key="zap" className="w-4 h-4" />,
            color: "bg-red-500",
            clickUrl: null,
            imageUrl: "https://images.pexels.com/photos/4312860/pexels-photo-4312860.jpeg",
            badge: "Hot Deal"
        },
        {
            title: "Deal of the Day",
            description: "Limited time offers",
            icon: <Clock key="clock" className="w-4 h-4" />,
            color: "bg-blue-500",
            clickUrl: null,
            imageUrl: "https://images.pexels.com/photos/4889065/pexels-photo-4889065.jpeg",
            badge: "Today Only"
        },
        {
            title: "Best Sellers",
            description: "Top rated products",
            icon: <Star key="star" className="w-4 h-4" />,
            color: "bg-green-500",
            clickUrl: null,
            imageUrl: "https://images.pexels.com/photos/4312860/pexels-photo-4312860.jpeg",
            badge: "Popular"
        }
    ];

    // Use ads if available, otherwise use fallback
    const deals = ads.length > 0 
        ? ads.slice(0, 3).map((ad, index) => ({
            title: ad.title,
            description: ad.description || "Special offer",
            icon: [<Zap key="zap" className="w-4 h-4" />, <Clock key="clock" className="w-4 h-4" />, <Star key="star" className="w-4 h-4" />][index % 3],
            color: ["bg-red-500", "bg-blue-500", "bg-green-500"][index % 3],
            clickUrl: ad.click_url,
            imageUrl: ad.media_url,
            badge: ["Hot Deal", "Limited", "Special"][index % 3]
        }))
        : fallbackDeals;

    if (isLoading) {
        return (
            <div className="w-full">
                <h3 className="font-semibold text-lg mb-3 px-1">Special Offers</h3>
                <div className="grid grid-cols-1 gap-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden bg-white">
                            <div className="relative h-24 bg-gray-200 animate-pulse" />
                            <div className="p-3 space-y-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Special Offers</h3>
                {ads.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Live
                    </Badge>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
                {deals.map((deal, index) => (
                    <motion.div
                        key={`${deal.title}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                        <Card className="overflow-hidden bg-white hover:shadow-lg transition-all duration-300 group border-0 shadow-sm">
                            <div className="relative h-24">
                                <Image
                                    src={deal.imageUrl}
                                    alt={deal.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="100vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
                                
                                {/* Icon and Badge */}
                                <div className="absolute top-2 left-2 flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${deal.color} text-white shadow-lg`}>
                                        {deal.icon}
                                    </div>
                                    <Badge className="bg-white/90 text-gray-800 text-xs font-medium">
                                        {deal.badge}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                            {deal.title}
                                        </h4>
                                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                            {deal.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {deal.clickUrl ? (
                                    <a href={deal.clickUrl} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button 
                                            size="sm" 
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-medium group-hover:shadow-md transition-all duration-300"
                                        >
                                            <span>Shop Now</span>
                                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
                                        </Button>
                                    </a>
                                ) : (
                                    <Button 
                                        size="sm" 
                                        className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-medium cursor-not-allowed" 
                                        disabled
                                    >
                                        Coming Soon
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
            
            {/* View All Deals Link */}
            {deals.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="mt-4 text-center"
                >
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-medium"
                    >
                        View All Deals
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </motion.div>
            )}
        </div>
    )
}
