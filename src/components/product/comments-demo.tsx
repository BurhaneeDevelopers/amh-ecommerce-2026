'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StarRating from './star-rating'
import CommentForm from './comment-form'
import CommentStats from './comment-stats'
import CommentsList from './comments-list'
import CommentsSection from './comments-section'

/**
 * Demo component to showcase the comments system
 * This can be used for testing or as a reference implementation
 */
export default function CommentsDemo() {
  const [demoProductId] = useState('demo-product-123')
  const [activeDemo, setActiveDemo] = useState<'full' | 'components'>('full')

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Product Comments System Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive review and feedback system for e-commerce products
        </p>
        <div className="flex justify-center gap-2">
          <Button
            variant={activeDemo === 'full' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('full')}
          >
            Full System
          </Button>
          <Button
            variant={activeDemo === 'components' ? 'default' : 'outline'}
            onClick={() => setActiveDemo('components')}
          >
            Individual Components
          </Button>
        </div>
      </div>

      {activeDemo === 'full' ? (
        <Card>
          <CardHeader>
            <CardTitle>Complete Comments System</CardTitle>
          </CardHeader>
          <CardContent>
            <CommentsSection productId={demoProductId} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Star Rating Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Star Rating Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Read-only ratings:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={5} readonly size="sm" />
                    <span className="text-sm">Small (5 stars)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={4.5} readonly size="md" showValue />
                    <span className="text-sm">Medium with value</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={3.2} readonly size="lg" showValue />
                    <span className="text-sm">Large with value</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Interactive rating:</p>
                <StarRating 
                  rating={0} 
                  onRatingChange={(rating) => console.log('Rating:', rating)}
                  size="lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Comment Stats Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Comment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentStats productId={demoProductId} />
            </CardContent>
          </Card>

          {/* Comment Form Demo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Comment Form</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentForm 
                productId={demoProductId}
                onSuccess={() => console.log('Comment submitted!')}
              />
            </CardContent>
          </Card>

          {/* Comments List Demo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Comments List</CardTitle>
            </CardHeader>
            <CardContent>
              <CommentsList productId={demoProductId} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">User Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Submit star ratings (1-5)</li>
                <li>• Write detailed reviews</li>
                <li>• Add pros and cons</li>
                <li>• Mark reviews helpful</li>
                <li>• Sort and filter reviews</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">Admin Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Approve/reject reviews</li>
                <li>• Reply to customers</li>
                <li>• Feature top reviews</li>
                <li>• View statistics</li>
                <li>• Moderation controls</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-700">Technical</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Real-time updates</li>
                <li>• Mobile responsive</li>
                <li>• Accessibility compliant</li>
                <li>• Performance optimized</li>
                <li>• Secure authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">1. Add to Product Page</h4>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
{`import CommentsSection from '@/components/product/comments-section'

<CommentsSection productId={productId} />`}
            </pre>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">2. Ensure User Authentication</h4>
            <p className="text-sm text-muted-foreground">
              The system uses the <code>current_user_auth_atom</code> from Jotai for user authentication.
              Make sure users are logged in to submit reviews.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">3. Admin Approval Process</h4>
            <p className="text-sm text-muted-foreground">
              Reviews are submitted with &apos;pending&apos; status and require admin approval before being visible.
              Use the admin dashboard to manage reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}