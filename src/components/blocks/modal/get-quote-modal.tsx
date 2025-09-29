/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { H3, P } from "@/components/typography/typography";
import { Product, Enquiry } from "@/supabase/schema/schema.type";
import { toast } from "sonner";
import Image from "next/image";
import { useAtomValue, useAtom } from "jotai";
import { current_user_auth_atom, productQuantityAtom } from "@/jotai/store";
import { useCreateNewEnquiry } from "@/api/enquiry.service";

interface GetQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess?: () => void;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone_number: string;
  city: string;
  company: string;
  quantity: number;
  message: string;
}

export default function GetQuoteModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: GetQuoteModalProps) {
  const user = useAtomValue(current_user_auth_atom);
  const [quantity, setQuantity] = useAtom(productQuantityAtom);
  const [formData, setFormData] = useState<QuoteFormData>({
    name: user?.full_name || "",
    email: user?.email || "",
    phone_number: user?.phone || "",
    city: "",
    company: "",
    quantity: quantity,
    message: "",
  });

  const createEnquiryMutation = useCreateNewEnquiry();

  const handleInputChange = (
    field: keyof QuoteFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Phone number validation regex (basic international format)
  const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone_number) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone number validation
    if (!phoneRegex.test(formData.phone_number)) {
      toast.error("Please enter a valid phone number (minimum 10 digits)");
      return;
    }

    if (formData.quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (!user?.id) {
      toast.error("Please login to submit an enquiry");
      return;
    }

    // Prepare enquiry payload
    const enquiryPayload: Enquiry = {
      user_id: user.id,
      products: [product?.id ?? ""],
      full_name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      quantity: formData.quantity.toString(),
      city: formData.city,
      company_name: formData.company,
      message: `Quantity: ${formData.quantity}${
        formData.message ? `\n\nAdditional Message: ${formData.message}` : ""
      }`,
    };

    try {
      await createEnquiryMutation.mutateAsync(enquiryPayload);

      toast.success("Quote request sent successfully!");
      onOpenChange(false);

      // Reset form
      setFormData({
        name: user?.full_name || "",
        email: user?.email || "",
        phone_number: user?.phone || "",
        city: "",
        company: "",
        quantity: quantity,
        message: "",
      });
      
      // Reset quantity to 1
      setQuantity(1);

      // Call success callback to show success modal
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to send quote request. Please try again."
      );
    }
  };

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
              <P className="text-sm text-gray-600">
                Model: {product.model_number}
              </P>
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("email", e.target.value)}
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
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange("phone_number", e.target.value)
                }
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
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter company name (optional)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity (Cartons) *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  setQuantity(newQuantity);
                  handleInputChange("quantity", newQuantity);
                }}
                placeholder="Enter quantity needed"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                &ldquo;1&rdquo; quantity is equivalent to one carton
              </p>
            </div>
            
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city name (optional)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
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
              disabled={createEnquiryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-[#272727]/80"
              disabled={createEnquiryMutation.isPending}
            >
              {createEnquiryMutation.isPending
                ? "Sending..."
                : "Send Quote Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
