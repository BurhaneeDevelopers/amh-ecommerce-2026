"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from "@/supabase/schema/schema.type";
import ProductCard from "@/components/blocks/product-card";
import { Search } from "lucide-react";

const mockProducts: Product[] = [
    {
        id: "1",
        model_tally_name: "p-123",
        product_name: "Abrasive Saw",
        product_image: "https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg",
        model_number: "AS-001",
        specifications: ["Heavy duty cutting tool"],
        photos: ["/images/abrasive-saw.png"],
        brand_id: "b1",
        category_id: "c1",
        tag: "featured",
        isFeatured: true,
        on_hand_qty: 12,
    },
    {
        id: "2",
        model_tally_name: "p-124",
        product_name: "Demo Tool",
        product_image: "https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg",
        model_number: "DT-002",
        specifications: ["Multipurpose tool"],
        photos: ["/images/demo.png"],
        brand_id: "b1",
        category_id: "c1",
        tag: "on sale",
        isFeatured: false,
        on_hand_qty: 0,
    },
];

const ITEMS_PER_PAGE = 6;

const MainColumn = () => {
    const [page, setPage] = useState(1);
    const [capacity, setCapacity] = useState<string | null>(null);
    const [tag, setTag] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Filtering
    const filteredProducts = mockProducts.filter((product) => {
        const matchesSearch = product.product_name.toLowerCase().includes(search.toLowerCase());
        const matchesCapacity = capacity ? product.capacity === capacity : true;
        const matchesTag = tag ? product.tag === tag : true;
        return matchesSearch && matchesCapacity && matchesTag;
    });

    // Pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    return (
        <div className="">
            {/* Filters */}
            <div className="flex flex-wrap gap-7 items-center mb-8">
                <div className="flex items-center w-full lg:w-auto">
                    <Input
                        type="text"
                        placeholder="Search products by details..."
                        className="bg-white rounded-e-none w-full flex-grow lg:!w-80 !text-base !py-7 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button className="rounded-s-none bg-gradient-to-tl from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-7 !px-4">
                        <Search className="!w-7 !h-7" />
                    </Button>
                </div>

                <Select onValueChange={(val) => setCapacity(val)}>
                    <SelectTrigger className="w-40 !py-7">
                        <SelectValue placeholder="Capacity" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="DIY">DIY</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(val) => setTag(val)}>
                    <SelectTrigger className="w-40 !py-7">
                        <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="on sale">On Sale</SelectItem>
                        <SelectItem value="out of stock">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {paginatedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            title={product.product_name}
                            model={product.model_number}
                            image={product.product_image || "/placeholder.png"}
                            badge={
                                product.tag === "on sale"
                                    ? "sale"
                                    : product.tag === "out of stock"
                                        ? "out_of_stock"
                                        : product.tag === "featured"
                                            ? "featured"
                                            : null
                            }
                            onShopNow={(id) => console.log("Shop Now:", id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No products found.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Prev
                    </Button>
                    {[...Array(totalPages)].map((_, i) => (
                        <Button
                            key={i}
                            variant={page === i + 1 ? "default" : "outline"}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MainColumn;