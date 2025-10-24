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
}: {
  product_id: string;
  className?: string;
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
            ? "bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)]"
            : "bg-transparent border border-amber-600 hover:text-white"
        } text-[#272727] absolute top-0 left-3 ${className}`}
        onClick={handleClick}
      >
        {creating ? (
          <Loader2 className="!size-6 stroke-amber-600 animate-spin" />
        ) : (
          <Heart
            className={`!size-6 ${
              isAdded ? "stroke-white fill-amber-600" : ""
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
