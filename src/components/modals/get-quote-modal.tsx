'use client'

import { X, Package, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { productQuantityAtom } from '@/jotai/store'
import { useCreateNewEnquiry } from '@/api/enquiry.service'
import { Use_auth } from '@/api/user.service'
import { Enquiry } from '@/supabase/schema/schema.type'
import { sendEnquiryEmail } from '@/lib/email'
import { Formik, Form, Field } from 'formik'
import Image from 'next/image'

interface GetQuoteModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: {
        id?: string | null | undefined
        name?: string
        sku?: string
        image_url?: string | null
        // Legacy support
        product_name?: string
        model_number?: string
        photos?: string[]
    }
    onSuccess?: () => void
}

interface FormValues {
    name: string
    email: string
    phone: string
    company: string
    city: string
    message: string
}

export default function GetQuoteModal({ open, onOpenChange, product, onSuccess }: GetQuoteModalProps) {
    const { data: user } = Use_auth()
    const [quantity, setQuantity] = useAtom(productQuantityAtom)
    const createEnquiryMutation = useCreateNewEnquiry()

    // Support both old and new schema
    const productName = product.name || product.product_name || 'Product'
    const productSku = product.sku || product.model_number || ''
    const productImage = product.image_url || product.photos?.[0] || null
    
    // SVG placeholder for missing images
    const placeholderSrc = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Crect x='150' y='130' width='100' height='80' rx='8' fill='%23cbd5e1'/%3E%3Ccircle cx='200' cy='270' r='20' fill='%23cbd5e1'/%3E%3Ctext x='200' y='330' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E`

    const initialValues: FormValues = {
        name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        company: user?.company_name || '',
        city: user?.city || '',
        message: ''
    }

    const handleSubmit = async (values: FormValues) => {
        // Validation
        if (!values.name || !values.email || !values.phone) {
            toast.error('Please fill in all required fields')
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(values.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        // Phone validation
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/
        if (!phoneRegex.test(values.phone)) {
            toast.error('Please enter a valid phone number (minimum 10 digits)')
            return
        }

        if (quantity < 1) {
            toast.error('Quantity must be at least 1')
            return
        }

        if (!user?.id) {
            toast.error('Please login to submit an enquiry')
            return
        }

        if (!product.id) {
            toast.error('Product information is missing')
            return
        }

        // Prepare enquiry payload
        const enquiryPayload: Enquiry = {
            user_id: user.id,
            products: [product.id],
            full_name: values.name,
            email: values.email,
            phone_number: values.phone,
            quantity: quantity.toString(),
            city: values.city,
            company_name: values.company,
            message: `Quantity: ${quantity}${values.message ? `\n\nAdditional Message: ${values.message}` : ''
                }`,
        }

        try {
            const result = await createEnquiryMutation.mutateAsync(enquiryPayload)

            // Send email notification (non-blocking)
            sendEnquiryEmail({
                userName: values.name,
                userEmail: values.email,
                userPhone: values.phone,
                companyName: values.company,
                city: values.city,
                products: [{
                    product_name: productName,
                    model_number: productSku,
                    quantity: quantity,
                }],
                message: values.message,
                isBulk: false,
                enquiryId: result?.id,
            }).catch(err => {
                console.error('Failed to send enquiry email:', err)
            })

            toast.success('Quote request sent successfully!', {
                description: 'Check your email for confirmation.',
            })
            onOpenChange(false)
            setQuantity(1)

            if (onSuccess) {
                onSuccess()
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send quote request. Please try again.'
            toast.error(errorMessage)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white" showCloseButton={false}>
                {/* Header - Trust-Building */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-[#ff6b35] rounded-lg flex-shrink-0">
                            <Package className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Request a Quote</h2>
                            <p className="text-slate-300 text-base">
                                Get competitive pricing and availability within 24 hours
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span>ISO Certified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span>Genuine Products</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span>Fast Response</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info - Prominent Display */}
                <div className="p-6 bg-slate-50 border-b-2 border-slate-200">
                    <div className="flex gap-5 items-center">
                        <div className="w-20 h-20 flex-shrink-0 bg-white border-2 border-slate-200 rounded-lg p-2">
                            <Image
                                src={productImage ?? placeholderSrc}
                                alt={productName}
                                className="w-full h-full object-contain"
                                loading="lazy"
                                width={80}
                                height={80}
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{productName}</h3>
                            {productSku && (
                                <p className="text-sm text-slate-600 font-medium">Model: {productSku}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form - Clean & Professional */}
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                        <User className="w-4 h-4 text-[#ff6b35]" />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        as={Input}
                                        name="name"
                                        required
                                        placeholder="Enter your full name"
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                        <Mail className="w-4 h-4 text-[#ff6b35]" />
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        as={Input}
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="your.email@company.com"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                        <Phone className="w-4 h-4 text-[#ff6b35]" />
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        as={Input}
                                        name="phone"
                                        required
                                        placeholder="+91 98843 69751"
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        Company Name
                                    </label>
                                    <Field
                                        as={Input}
                                        name="company"
                                        placeholder="Your company name"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">
                                        City
                                    </label>
                                    <Field
                                        as={Input}
                                        name="city"
                                        placeholder="Chennai"
                                        className="h-11"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity === 0 ? '' : quantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                setQuantity(0);
                                            } else {
                                                const numValue = parseInt(value);
                                                if (!isNaN(numValue) && numValue >= 0) {
                                                    setQuantity(numValue);
                                                }
                                            }
                                        }}
                                        onBlur={() => {
                                            if (quantity < 1) {
                                                setQuantity(1);
                                            }
                                        }}
                                        placeholder="Enter quantity"
                                        className={`h-11 ${quantity < 1 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    {quantity < 1 && (
                                        <p className="text-xs text-red-600 mt-1 font-medium">Minimum quantity is 1</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                    <MessageSquare className="w-4 h-4 text-[#ff6b35]" />
                                    Additional Requirements
                                </label>
                                <Field
                                    as={Textarea}
                                    name="message"
                                    placeholder="Specify any technical requirements, delivery timeline, or questions..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            {/* Actions - Prominent CTA */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t-2 border-slate-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-50 font-bold"
                                    disabled={createEnquiryMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-bold text-base shadow-lg"
                                    disabled={createEnquiryMutation.isPending}
                                >
                                    {createEnquiryMutation.isPending ? 'Submitting...' : 'Submit Quote Request'}
                                </Button>
                            </div>

                            {/* Trust Footer */}
                            <div className="text-center pt-4 text-sm text-slate-600">
                                <p>We&apos;ll respond within 24 hours with pricing and availability</p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
