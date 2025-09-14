"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Trash2, MessageSquare, ListChecks, ArrowLeft } from "lucide-react";
import { H2, H6 } from "@/components/typography/typography";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import {
  useGetWishlistByUser,
  useDeleteWishlist,
} from "@/api/wishlist.service";
import { WishlistWithProduct } from "@/supabase/schema/schema.type";
import RemoveWishlistModal from "@/components/blocks/modal/remove-wishlist";

const ITEMS_PER_PAGE = 10;

const WishList = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [product_id, setProduct_id] = useState("")
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const user = useAtomValue(current_user_auth_atom);
  const {
    data: wishlistData,
    isLoading,
    error,
    refetch,
  } = useGetWishlistByUser(user?.id ?? "");
  const deleteWishlistMutation = useDeleteWishlist();

  // Pagination logic for wishlist data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedItems =
    wishlistData?.slice(start, start + ITEMS_PER_PAGE) || [];
  const totalPages = Math.ceil((wishlistData?.length || 0) / ITEMS_PER_PAGE);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkEnquiry = () => {
    const selectedItems =
      wishlistData?.filter((i) => selected.includes(i.id || "")) || [];
    console.log("Bulk Enquiry:", selectedItems);
    // integrate with API later
  };

  const handleGetQuote = (item: WishlistWithProduct) => {
    console.log("Get Quote for:", item);
    // redirect / API call for quote
  };

  return (
    <Container>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 items-center">
          <ArrowLeft size={20} className="stroke-muted-foreground" />
          <H6 className="font-semibold font-mono text-muted-foreground">
            Continue Shopping
          </H6>
        </div>
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-[var(--color-primary)] p-2 rounded-full">
            <ListChecks className="w-4 h-4 stroke-white" />
          </div>
          <H2 className="">My Wish List</H2>
        </div>
        <div />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">Loading your wishlist...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-500">Error loading wishlist</div>
        </div>
      ) : !wishlistData || wishlistData.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-500">Your wishlist is empty</div>
        </div>
      ) : (
        <Table className="!rounded-t-xl overflow-hidden mt-7">
          <TableHeader className="bg-zinc-200 !py-2">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item.id || "")}
                    onCheckedChange={() => toggleSelect(item.id || "")}
                  />
                </TableCell>
                <TableCell>
                  {item.products.photos[0] ? (
                    <Image
                      src={item.products.photos[0] || "/placeholder-image.png"}
                      alt={item.products.product_name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{item.products.product_name}</TableCell>
                <TableCell>{item.products.model_number}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    onClick={() => handleGetQuote(item)}
                    className="text-base"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Get Quote
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (!user) return;
                      setShowRemoveModal(true);
                      setProduct_id(item.product_id);
                    }}
                    disabled={deleteWishlistMutation.isPending}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination - only show if there are items */}
      {wishlistData && wishlistData.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center mt-4">
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages} ({wishlistData.length} items)
          </div>
        </div>
      )}

      {/* Bulk Enquiry */}
      {selected.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleBulkEnquiry}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Send Bulk Enquiry
          </Button>
        </div>
      )}

      <RemoveWishlistModal
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        product_id={product_id}
        user_id={user?.id ?? ""}
        refetch={refetch}
      />
    </Container>
  );
};

export default WishList;
