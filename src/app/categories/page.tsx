"use client";

import { Container } from "@/components/layout/container";
import { useGetMainCategoriesWithSubcategories } from "@/api/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Category } from "@/supabase/schema/schema.type";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetMainCategoriesWithSubcategories();

  if (isLoading) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive range of hydraulic and industrial products organized by category and brand
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const subcategories = Array.isArray(category.subcategories) 
              ? category.subcategories 
              : [];

            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-xl"
              >
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: category.color || '#f97316' }}
                />

                <div className="p-6">
                  {/* Main Category Header */}
                  <Link href={`/category/${category.slug || category.id}`}>
                    <div className="flex items-start gap-4 mb-4 cursor-pointer">
                      <div className="flex-shrink-0">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={56}
                            height={56}
                            className="w-14 h-14 object-cover rounded-lg"
                            loading="lazy"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 56 56"
                            className="w-14 h-14"
                          >
                            <rect width="56" height="56" rx="12" fill={`${category.color || '#f97316'}20`} />
                            <rect x="14" y="22" width="28" height="22" rx="4" fill={category.color || '#f97316'} opacity="0.72" />
                            <rect x="18" y="15" width="20" height="11" rx="3" fill={category.color || '#f97316'} opacity="0.95" />
                            <rect x="22" y="30" width="12" height="9" rx="2" fill="white" opacity="0.55" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Subcategories List */}
                  {subcategories.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Subcategories ({subcategories.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {subcategories.slice(0, 8).map((subcat: Category) => (
                          <Link
                            key={subcat.id}
                            href={`/category/${subcat.slug || subcat.id}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-colors group/sub"
                          >
                            <span className="text-sm text-gray-700 group-hover/sub:text-primary font-medium">
                              {subcat.name}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/sub:text-primary group-hover/sub:translate-x-1 transition-all" />
                          </Link>
                        ))}
                        {subcategories.length > 8 && (
                          <Link
                            href={`/category/${category.slug || category.id}`}
                            className="flex items-center justify-center p-2 text-xs text-primary font-semibold hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            +{subcategories.length - 8} more
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View All Products Link */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <Link
                      href={`/category/${category.slug || category.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-primary group-hover:text-primary/80"
                    >
                      <span>View All Products</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories available
              </h3>
              <p className="text-gray-500">
                Categories will appear here once they are added
              </p>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
