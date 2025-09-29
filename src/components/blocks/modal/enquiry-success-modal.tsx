"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { H3, P } from "@/components/typography/typography";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface EnquirySuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueShopping?: () => void;
}

export default function EnquirySuccessModal({
  open,
  onOpenChange,
  onContinueShopping,
}: EnquirySuccessModalProps) {
  const router = useRouter();
  const handleContinueShopping = () => {
    onOpenChange(false);
    if (onContinueShopping) {
      onContinueShopping();
      router.push("/");
    }
  };

  const handleOkay = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Enquiry Submitted Successfully</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-6 space-y-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <H3 className="text-xl font-semibold text-gray-900">
              Enquiry Received!
            </H3>
            <P className="text-gray-600 max-w-sm">
              Thank you for your enquiry. We have received your request and will be in touch with you soon with a detailed quote.
            </P>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 w-full">
            <Button
              variant="outline"
              onClick={handleOkay}
              className="flex-1"
            >
              Okay
            </Button>
            <Button
              onClick={handleContinueShopping}
              className="flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] font-bold text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
