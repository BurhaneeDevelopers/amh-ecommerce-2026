'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { current_user_auth_atom } from '@/jotai/store'
import { useGetProductComments, useMarkCommentHelpful } from '@/api/comment.service'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import StarRating from './star-rating'
import { ProductComment } from '@/supabase/schema/schema.type'
import { formatDistanceToNow } from 'date-fns'
import { ThumbsUp, ThumbsDown, User, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CommentsListProps {
  productId: string
}

interface CommentItemProps {
  comment: ProductComment
  currentUserId?: string
}

function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false)
  const markHelpfulMutation = useMarkCommentHelpful()

  const handleMarkHelpful = async (isHelpful: boolean) => {
    if (!currentUserId) {
      toast.error('Please login to mark reviews as helpful')
      return
    }

    if (!comment.id) return

    setIsHelpfulLoading(true)
    try {
      const result = await markHelpfulMutation.mutateAsync({
        commentId: comment.id,
        userId: currentUserId,
        isHelpful
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isHelpful ? 'Marked as helpful' : 'Feedback recorded')
      }
    } catch (error) {
      toast.error('Failed to record feedback')
    } finally {
      setIsHelpfulLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  return (
    <Card className="border-l-4 border-l-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                {comment.user?.profile_image ? (
                  <img
                    src={comment.user.profile_image}
                    alt={comment.user.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    {comment.user?.full_name || 'Anonymous User'}
                  </h4>
                  {comment.is_verified_purchase && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </Badge>
                  )}
                  {comment.is_featured && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                      Featured Review
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={comment.rating} readonly size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(comment.created_at || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg">{comment.title}</h3>

          {/* Comment */}
          <p className="text-muted-foreground leading-relaxed">{comment.comment}</p>

          {/* Pros and Cons */}
          {(comment.pros && comment.pros.length > 0) || (comment.cons && comment.cons.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comment.pros && comment.pros.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-green-700 flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    Pros
                  </h5>
                  <ul className="space-y-1">
                    {comment.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {comment.cons && comment.cons.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-red-700 flex items-center gap-1">
                    <ThumbsDown className="w-4 h-4" />
                    Cons
                  </h5>
                  <ul className="space-y-1">
                    {comment.cons.map((con, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}

          {/* Admin Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-l-blue-500">
              <div className="space-y-3">
                {comment.replies
                  .filter((reply: any) => reply.is_public)
                  .map((reply: any) => (
                    <div key={reply.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Admin Response
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{reply.reply_text}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Helpful Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(true)}
                disabled={isHelpfulLoading || !currentUserId}
                className="text-muted-foreground hover:text-green-600"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(false)}
                disabled={isHelpfulLoading || !currentUserId}
                className="text-muted-foreground hover:text-red-600"
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                Not Helpful
              </Button>
            </div>
            
            {comment.helpful_count && comment.helpful_count > 0 && (
              <span className="text-sm text-muted-foreground">
                {comment.helpful_count} people found this helpful
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CommentSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CommentsList({ productId }: CommentsListProps) {
  const [currentUser] = useAtom(current_user_auth_atom)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low'>('newest')
  
  const { data: comments = [], isLoading, error } = useGetProductComments(productId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load reviews</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
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

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
      case 'rating_high':
        return b.rating - a.rating
      case 'rating_low':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Customer Reviews ({comments.length})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border rounded-md text-sm bg-background"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating_high">Highest Rating</option>
          <option value="rating_low">Lowest Rating</option>
        </select>
      </div>

      {/* Comments */}
      <div className="space-y-6">
        {sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUser?.id}
          />
        ))}
      </div>
    </div>
  )
}