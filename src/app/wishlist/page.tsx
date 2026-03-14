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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash2, MessageSquare, ListChecks, ArrowLeft, ShoppingCart, Mail } from "lucide-react";
import { H2, H6, P } from "@/components/typography/typography";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import {
  useGetWishlistByUser,
  useDeleteWishlist,
  useDeleteWishlistById,
} from "@/api/wishlist.service";
import { WishlistWithProduct } from "@/supabase/schema/schema.type";
import RemoveWishlistModal from "@/components/blocks/modal/remove-wishlist";
import GetQuoteModal from "@/components/modals/get-quote-modal";
import BulkQuoteModal from "@/components/modals/bulk-quote-modal";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

const WishList = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [product_id, setProduct_id] = useState("")
  const [wishlist_id, setWishlist_id] = useState("")
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showBulkQuoteModal, setShowBulkQuoteModal] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    product_name: string;
    model_number?: string;
    photos: string[];
  } | null>(null);

  const user = useAtomValue(current_user_auth_atom);
  const {
    data: wishlistData,
    isLoading,
    error,
    refetch,
  } = useGetWishlistByUser(user?.id ?? "");
  const deleteWishlistMutation = useDeleteWishlist();
  const deleteWishlistByIdMutation = useDeleteWishlistById();

  // Pagination logic for wishlist data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedItems =
    wishlistData?.slice(start, start + ITEMS_PER_PAGE) || [];
  const totalPages = Math.ceil((wishlistData?.length || 0) / ITEMS_PER_PAGE);

  // Filter out items with null products for selection
  const selectableItems = paginatedItems.filter(item => item.products && item.product_id);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkEnquiry = () => {
    const selectedItems = wishlistData?.filter((i) =>
      selected.includes(i.id || "") && i.products && i.product_id
    ) || [];

    if (selectedItems.length === 0) {
      toast.error('No valid products selected');
      return;
    }

    const bulkProducts = selectedItems.map(item => ({
      id: item.product_id!,
      product_name: item.products!.product_name,
      model_number: item.products!.model_number,
      photos: item.products!.photos || [],
      quantity: quantities[item.id || ''] || 1
    }));

    setShowBulkQuoteModal(true);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handleGetQuote = (item: WishlistWithProduct) => {
    if (!item.products || !item.product_id) {
      toast.error('Product information is not available');
      return;
    }

    setSelectedProduct({
      id: item.product_id,
      product_name: item.products.product_name,
      model_number: item.products.model_number,
      photos: item.products.photos || []
    });
    setShowQuoteModal(true);
  };

  const handleDeleteItem = async (item: WishlistWithProduct) => {
    if (!user) return;

    try {
      if (item.product_id) {
        // Normal deletion with product_id
        setShowRemoveModal(true);
        setProduct_id(item.product_id);
      } else {
        // Delete by wishlist_id for null products
        await deleteWishlistByIdMutation.mutateAsync(item.wishlist_id);
        await refetch();
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
    }
  };

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Continue Shopping</span>
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 p-3 rounded-xl shadow-lg">
              <ListChecks className="w-6 h-6 stroke-white" />
            </div>
            <div>
              <H2 className="mb-1">My Wish List</H2>
              <P className="text-sm text-muted-foreground">
                {wishlistData?.length || 0} {wishlistData?.length === 1 ? 'item' : 'items'} saved
              </P>
            </div>
          </div>

          {/* Bulk Actions Bar - Always visible with helpful text */}
          {wishlistData && wishlistData.length > 0 && (
            <Card className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-3 flex-wrap">
                {selected.length > 0 ? (
                  <>
                    <Badge variant="secondary" className="bg-amber-600 text-white">
                      {selected.length} selected
                    </Badge>
                    <Button
                      onClick={handleBulkEnquiry}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Bulk Enquiry
                    </Button>
                  </>
                ) : (
                  <P className="text-sm text-amber-800 flex items-center gap-2">
                    <span className="font-medium">💡 Tip:</span>
                    Select items to send bulk enquiry
                  </P>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
            <P className="text-muted-foreground">Loading your wishlist...</P>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-12 border-red-200 bg-red-50">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-red-100 p-4 rounded-full">
              <MessageSquare className="h-8 w-8 text-red-600" />
            </div>
            <P className="text-red-600 font-medium">Error loading wishlist</P>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </Card>
      ) : !wishlistData || wishlistData.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <H6 className="text-gray-600">Your wishlist is empty</H6>
            <P className="text-sm text-muted-foreground text-center max-w-md">
              Start adding products to your wishlist to keep track of items you love
            </P>
            <Link href="/products">
              <Button className="mt-2">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-50 hover:to-gray-100">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.length === selectableItems.length && selectableItems.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelected(selectableItems.map(item => item.id || ""));
                      } else {
                        setSelected([]);
                      }
                    }}
                    aria-label="Select all valid items"
                  />
                </TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead className="font-semibold">Product Name</TableHead>
                <TableHead className="font-semibold">Model Number</TableHead>
                <TableHead className="font-semibold w-32">Quantity</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item, index) => {
                const hasNullProduct = !item.products || !item.product_id;

                return (
                  <TableRow
                    key={item.id}
                    className={`transition-colors ${hasNullProduct
                        ? "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-400"
                        : selected.includes(item.id || "")
                          ? "bg-amber-50 hover:bg-amber-100"
                          : "hover:bg-gray-50"
                      }`}
                  >
                    <TableCell>
                      {!hasNullProduct && (
                        <Checkbox
                          checked={selected.includes(item.id || "")}
                          onCheckedChange={() => toggleSelect(item.id || "")}
                          aria-label={`Select ${item.products?.product_name || 'item'}`}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                        {item.products?.photos?.[0] ? (
                          <Image
                            width={500}
                            height={500}
                            src={item.products.photos[0]}
                            alt={item.products.product_name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">
                            {hasNullProduct ? "⚠️" : "No Image"}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {hasNullProduct ? (
                          <>
                            <span className="font-medium text-red-600">
                              Invalid Product
                            </span>
                            <span className="text-xs text-red-500">
                              This product no longer exists
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium text-foreground">
                              {item.products?.product_name || "N/A"}
                            </span>
                            {item.products?.product_name && (
                              <Link
                                href={`/products/${item.product_id}`}
                                className="text-xs text-[var(--color-primary)] hover:underline"
                              >
                                View Details →
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {hasNullProduct ? (
                        <Badge variant="outline" className="border-red-300 text-red-600">
                          N/A
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.products?.model_number || "N/A"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!hasNullProduct && (
                        <Input
                          type="number"
                          min="1"
                          value={quantities[item.id || ''] === 0 ? '' : quantities[item.id || ''] || 1}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              handleQuantityChange(item.id || '', 0);
                            } else {
                              const numValue = parseInt(value);
                              if (!isNaN(numValue) && numValue >= 0) {
                                handleQuantityChange(item.id || '', numValue);
                              }
                            }
                          }}
                          onBlur={() => {
                            if ((quantities[item.id || ''] || 0) < 1) {
                              handleQuantityChange(item.id || '', 1);
                            }
                          }}
                          className="w-20 h-9 text-center"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {!hasNullProduct && (
                          <Button
                            onClick={() => handleGetQuote(item)}
                            size="sm"
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Get Quote
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteItem(item)}
                          disabled={deleteWishlistMutation.isPending || deleteWishlistByIdMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                          {hasNullProduct && <span className="ml-1">Remove</span>}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {wishlistData && wishlistData.length > ITEMS_PER_PAGE && (
        <Card className="mt-6 p-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <P className="text-sm text-muted-foreground">
              Showing {start + 1}-{Math.min(start + ITEMS_PER_PAGE, wishlistData.length)} of {wishlistData.length} items
            </P>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      className="w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      <RemoveWishlistModal
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        product_id={product_id}
        user_id={user?.id ?? ""}
        refetch={refetch}
      />

      {selectedProduct && (
        <GetQuoteModal
          open={showQuoteModal}
          onOpenChange={setShowQuoteModal}
          product={selectedProduct}
          onSuccess={() => {
            setSelectedProduct(null);
          }}
        />
      )}

      <BulkQuoteModal
        open={showBulkQuoteModal}
        onOpenChange={setShowBulkQuoteModal}
        products={
          wishlistData
            ?.filter((i) => selected.includes(i.id || "") && i.products && i.product_id)
            .map(item => ({
              id: item.product_id!,
              product_name: item.products!.product_name,
              model_number: item.products!.model_number,
              photos: item.products!.photos || [],
              quantity: quantities[item.id || ''] || 1
            })) || []
        }
        onSuccess={() => {
          setSelected([]);
        }}
      />
    </Container>
  );
};

export default WishList;
