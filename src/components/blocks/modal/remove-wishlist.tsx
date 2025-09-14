"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteWishlist } from "@/api/wishlist.service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product_id: string;
  user_id: string;
  refetch: () => void;
}

const RemoveWishlistModal = ({
  open,
  onOpenChange,
  product_id,
  user_id,
  refetch,
}: Props) => {
  const { mutate: removeWishlist, isPending } = useDeleteWishlist();

  const handleRemove = () => {
    removeWishlist(
      { user_id, product_id },
      {
        onSuccess: () => {
          toast.success("Removed from wishlist");
          refetch();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error removing product");
          console.error(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove from wishlist?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveWishlistModal;
