"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import AuthModal from "./modal/auth-modal";
import {
  useCreateNewWishlist,
  useGetWishlistByUser,
} from "@/api/wishlist.service";
import { toast } from "sonner";
import RemoveWishlistModal from "./modal/remove-wishlist";

const WishlistButton = ({
  product_id = "",
  className,
  compact = false,
}: {
  product_id: string;
  className?: string;
  compact?: boolean;
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const user = useAtomValue(current_user_auth_atom);
  const { data: wishlist, refetch } = useGetWishlistByUser(user?.id ?? "");

  const { mutate: createWishlist, isPending: creating } =
    useCreateNewWishlist();

  const isAdded = useMemo(
    () => wishlist?.some((item) => item.product_id === product_id) ?? false,
    [wishlist, product_id]
  );

  const handleAdd = () => {
    if (!user) return setShowAuthModal(true);

    createWishlist(
      { user_id: user.id, product_id },
      {
        onSuccess: () => {
          toast.success("Product added to wishlist");
          refetch();
        },
        onError: (error) => {
          toast.error("Error adding product");
          console.error(error);
        },
      }
    );
  };

  const handleClick = () => {
    if (!user) return setShowAuthModal(true);
    if (isAdded) setShowRemoveModal(true);
    else handleAdd();
  };

  return (
    <>
      <Button
        className={`${
          isAdded
            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg"
            : "bg-white/95 hover:bg-white border-2 border-gray-300 hover:border-red-400 shadow-md"
        } backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
          compact ? 'p-2 h-auto min-w-0 rounded-lg' : 'rounded-xl'
        } ${className}`}
        onClick={handleClick}
      >
        {creating ? (
          <Loader2 className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} ${isAdded ? 'text-white' : 'text-red-500'} animate-spin`} />
        ) : (
          <Heart
            className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} transition-all duration-300 ${
              isAdded ? "fill-white stroke-white" : "stroke-red-500 hover:fill-red-100"
            }`}
          />
        )}
      </Button>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <RemoveWishlistModal
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        product_id={product_id}
        user_id={user?.id ?? ""}
        refetch={refetch}
      />
    </>
  );
};

export default WishlistButton;
