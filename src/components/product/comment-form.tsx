'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { current_user_auth_atom } from '@/jotai/store'
import { useCreateComment } from '@/api/comment.service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import StarRating from './star-rating'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface CommentFormProps {
  productId: string
  onSuccess?: () => void
}

export default function CommentForm({ productId, onSuccess }: CommentFormProps) {
  const [currentUser] = useAtom(current_user_auth_atom)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: [] as string[],
    cons: [] as string[],
    prosInput: '',
    consInput: ''
  })

  const createCommentMutation = useCreateComment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast.error('Please login to submit a review')
      return
    }

    if (formData.rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const result = await createCommentMutation.mutateAsync({
        product_id: productId,
        user_id: currentUser.id,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        pros: formData.pros.length > 0 ? formData.pros : undefined,
        cons: formData.cons.length > 0 ? formData.cons : undefined,
        is_verified_purchase: false // You can implement purchase verification logic
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      // Handle both cases: when we get data back and when we get a success message
      if (result.data?.message) {
        toast.success(result.data.message)
      } else {
        toast.success('Review submitted successfully! It will be visible after admin approval.')
      }
      
      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        pros: [],
        cons: [],
        prosInput: '',
        consInput: ''
      })
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to submit review. Please try again.')
    }
  }

  const addPro = () => {
    if (formData.prosInput.trim() && !formData.pros.includes(formData.prosInput.trim())) {
      setFormData(prev => ({
        ...prev,
        pros: [...prev.pros, prev.prosInput.trim()],
        prosInput: ''
      }))
    }
  }

  const addCon = () => {
    if (formData.consInput.trim() && !formData.cons.includes(formData.consInput.trim())) {
      setFormData(prev => ({
        ...prev,
        cons: [...prev.cons, prev.consInput.trim()],
        consInput: ''
      }))
    }
  }

  const removePro = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }))
  }

  const removeCon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }))
  }

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Please login to write a review</p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
              Write a Review
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Write Your Review
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                size="lg"
              />
              <span className="text-sm text-muted-foreground">
                {formData.rating > 0 && `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              placeholder="Summarize your experience..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder="Share your detailed experience with this product..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.comment.length}/1000 characters
            </p>
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <Label>What did you like? (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a positive point..."
                value={formData.prosInput}
                onChange={(e) => setFormData(prev => ({ ...prev, prosInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
              />
              <Button type="button" onClick={addPro} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {formData.pros.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.pros.map((pro, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {pro}
                    <button
                      type="button"
                      onClick={() => removePro(index)}
                      className="ml-1 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <Label>What could be improved? (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add an area for improvement..."
                value={formData.consInput}
                onChange={(e) => setFormData(prev => ({ ...prev, consInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
              />
              <Button type="button" onClick={addCon} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {formData.cons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.cons.map((con, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                    {con}
                    <button
                      type="button"
                      onClick={() => removeCon(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createCommentMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {createCommentMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createCommentMutation.isPending}
            >
              Cancel
            </Button>
          </div>
          
          {/* Info message about review process */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Review Process:</strong> Your review will be submitted for approval. 
              Once our team reviews it, it will be published and visible to other customers.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}