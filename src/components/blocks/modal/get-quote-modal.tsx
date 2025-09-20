'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { H3, P } from '@/components/typography/typography'
import { Product } from '@/supabase/schema/schema.type'
import { toast } from 'sonner'
import Image from 'next/image'

interface GetQuoteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

interface QuoteFormData {
  name: string
  email: string
  phone: string
  company: string
  quantity: number
  message: string
}

export default function GetQuoteModal({ open, onOpenChange, product }: GetQuoteModalProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 1,
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof QuoteFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.quantity < 1) {
      toast.error('Quantity must be at least 1')
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the quote request to your backend
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Quote request sent successfully! We will contact you soon.')
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        quantity: 1,
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send quote request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Quote</DialogTitle>
        </DialogHeader>
        
        {/* Product Summary */}
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={product.photos[0] || "/placeholder.jpg"}
              alt={product.product_name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <H3 className="text-lg font-medium">{product.product_name}</H3>
            {product.model_number && (
              <P className="text-sm text-gray-600">Model: {product.model_number}</P>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Enter company name (optional)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              placeholder="Enter quantity needed"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any additional requirements or questions..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Quote Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
