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
        model_number: "AS-001",
        specifications: ["Heavy duty cutting tool"],
        pcs_per_crtn: 1,
        photos: ["https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg"],
        brand_id: "b1",
        category_id: "c1",
        capacity: "Professional",
        is_on_sale: false,
        is_featured: true,
        on_hand_qty: 12,
        stock_status: true,
    },
    {
        id: "2",
        model_tally_name: "p-124",
        product_name: "Demo Tool",
        model_number: "DT-002",
        specifications: ["Multipurpose tool"],
        pcs_per_crtn: 1,
        photos: ["https://images.pexels.com/photos/5974301/pexels-photo-5974301.jpeg"],
        brand_id: "b1",
        category_id: "c1",
        capacity: "DIY",
        is_on_sale: true,
        is_featured: false,
        on_hand_qty: 0,
        stock_status: false,
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
        const matchesTag = tag ? 
            (tag === "featured" && product.is_featured) ||
            (tag === "on sale" && product.is_on_sale) ||
            (tag === "out of stock" && !product.stock_status)
            : true;
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
                            model_tally_name={product.model_tally_name}
                            product_name={product.product_name}
                            model_number={product.model_number}
                            photos={product.photos}
                            specifications={product.specifications}
                            pcs_per_crtn={product.pcs_per_crtn}
                            brand_id={product.brand_id}
                            category_id={product.category_id}
                            capacity={product.capacity}
                            is_on_sale={product.is_on_sale}
                            is_featured={product.is_featured}
                            on_hand_qty={product.on_hand_qty}
                            stock_status={product.stock_status}
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