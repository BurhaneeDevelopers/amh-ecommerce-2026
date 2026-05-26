"use client";

import { Container } from "@/components/layout/container";
import { useGetMainCategories } from "@/api/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetMainCategories();

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
            Browse our comprehensive range of hydraulic and industrial products
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
              <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-primary transition-all duration-300 overflow-hidden hover:shadow-xl"
            >
              {/* Color accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: category.color || '#f97316' }}
              />

              <div className="p-6">
                {/* Image or SVG icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
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

                {/* View Products Link */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium text-primary group-hover:text-primary/80">
                    View Products
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
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
