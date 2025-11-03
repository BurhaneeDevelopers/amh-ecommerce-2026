'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CommentStats from './comment-stats'
import CommentForm from './comment-form'
import CommentsList from './comments-list'

interface CommentsSectionProps {
  productId: string
}

export default function CommentsSection({ productId }: CommentsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCommentSuccess = () => {
    // Trigger a refresh of the comments data
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="write">Write Review</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-6 mt-6">
          {/* Stats */}
          <CommentStats productId={productId} key={`stats-${refreshKey}`} />
          
          {/* Comments List */}
          <CommentsList productId={productId} key={`list-${refreshKey}`} />
        </TabsContent>
        
        <TabsContent value="write" className="mt-6">
          <CommentForm 
            productId={productId} 
            onSuccess={handleCommentSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}