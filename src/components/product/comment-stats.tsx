'use client'

import { useGetProductCommentStats } from '@/api/comment.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import StarRating from './star-rating'
import { Skeleton } from '@/components/ui/skeleton'

interface CommentStatsProps {
  productId: string
}

export default function CommentStats({ productId }: CommentStatsProps) {
  const { data: stats, isLoading, error } = useGetProductCommentStats(productId)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return null
  }

  if (stats.total_reviews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to review this product!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold">{stats.average_rating}</div>
          <div className="flex-1">
            <StarRating rating={stats.average_rating} readonly size="md" />
            <p className="text-sm text-muted-foreground mt-1">
              Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution]
            const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-right">{rating}</span>
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="w-8 text-muted-foreground">{count}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}