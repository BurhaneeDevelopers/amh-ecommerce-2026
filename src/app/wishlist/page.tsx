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
import { Trash2, MessageSquare, ListChecks } from "lucide-react";
import { H2, } from "@/components/typography/typography";

// Example type for wishlist item
type WishListItem = {
    id: string;
    product_image: string;
    product_name: string;
    model_number: string;
};

const mockData: WishListItem[] = [
    {
        id: "1",
        product_image: "/images/abrasive-saw.png",
        product_name: "Abrasive Saw",
        model_number: "Product 3",
    },
    {
        id: "2",
        product_image: "/images/demo.png",
        product_name: "Demo Tool",
        model_number: "Product 4",
    },
];

const ITEMS_PER_PAGE = 5;

const WishList = () => {
    const [items, setItems] = useState<WishListItem[]>(mockData);
    const [selected, setSelected] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    const start = (page - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(start, start + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const toggleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setSelected((prev) => prev.filter((i) => i !== id));
    };

    const handleBulkEnquiry = () => {
        const selectedItems = items.filter((i) => selected.includes(i.id));
        console.log("Bulk Enquiry:", selectedItems);
        // integrate with API later
    };

    const handleGetQuote = (item: WishListItem) => {
        console.log("Get Quote for:", item);
        // redirect / API call for quote
    };

    return (
        <Container>

            <div className="flex justify-center items-center gap-2 mb-6">
                <div className="bg-[var(--color-primary)] p-4 rounded-full">
                    <ListChecks className="w-7 h-7 stroke-white" />
                </div>
                <H2 className="font-semibold font-mono">My Wish List</H2>
            </div>

            <Table className="!rounded-t-xl overflow-hidden">
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
                                    checked={selected.includes(item.id)}
                                    onCheckedChange={() => toggleSelect(item.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    width={50}
                                    height={50}
                                    className="rounded-md"
                                />
                            </TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.model_number}</TableCell>
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
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
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
                    Page {page} of {totalPages}
                </div>
            </div>

            {/* Bulk Enquiry */}
            {selected.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleBulkEnquiry} className="bg-yellow-500 hover:bg-yellow-600">
                        Send Bulk Enquiry
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default WishList;
