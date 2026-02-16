"use client";

import { Menu, Search, Home, Package, BookOpen, Info, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ToggleCategories from "../blocks/toggle-categories";
import AccountMenu from "../layout/blocks/account-menu";
import SearchModal from "../blocks/search-modal";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import { useGetWishlistByUser } from "@/api/wishlist.service";
import { useGetAllCategories } from "@/api/category.service";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const user = useAtomValue(current_user_auth_atom);
  const { data: wishlistData } = useGetWishlistByUser(user?.id ?? "");
  const wishlistCount = wishlistData?.length || 0;
  const { data: allCategories = [] } = useGetAllCategories();

  // Get top 5 featured categories
  const featuredCategories = allCategories
    .filter(cat => cat.is_featured && cat.type === 'main')
    .slice(0, 5);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Package },
    { label: "About", href: "/about", icon: Info },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];

  return (
    <div className="min-w-full sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo - Much Larger */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="relative flex gap-4">
                <Image
                  alt="MSI Logo"
                  src="/logo.png"
                  width={500}
                  height={500}
                  className="object-cover h-20 bg-gray-50 p-2 w-36 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {/* <Image
                  alt="XLNT Logo"
                  src="/xlnt.png"
                  width={500}
                  height={500}
                  className="object-cover h-20 bg-gray-50 p-2 w-36 transition-transform duration-300 group-hover:scale-105"
                  priority
                /> */}
              </div>
            </Link>

            {/* Center: Enhanced Search Bar */}
            <div className="hidden lg:flex flex-1 mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-[#f38b00] transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder='Search for "Power Tools", "Drills", "Saws"...'
                  className="w-full pl-12 pr-4 py-4 text-sm font-medium bg-white border-2 border-gray-200 rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-[#f38b00] focus:border-transparent 
                           hover:border-[#f38b00]/40 hover:shadow-md
                           transition-all duration-300 placeholder:text-gray-400"
                  onClick={() => setIsSearchModalOpen(true)}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                    ctrl + K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Mobile/Tablet */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-[#f38b00]/10 rounded-xl"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="w-5 h-5 text-gray-700" />
              </Button>

              {/* Sign In / Account - Desktop */}
              <div className="hidden md:block">
                <AccountMenu />
              </div>

              {/* My Cart Button - Prominent */}
              <Link href="/wishlist">
                <Button 
                  size="lg"
                  className="relative gap-2.5 rounded-2xl bg-gradient-to-r from-[#f38b00] via-[#ff9500] to-[#ffed05] 
                           hover:from-[#e07a00] hover:via-[#ff8800] hover:to-[#ffd700] 
                           text-white font-bold shadow-lg hover:shadow-xl 
                           transition-all duration-300 hover:scale-105 
                           px-6 py-6 text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">My Cart</span>
                  {wishlistCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 min-w-[24px] h-[24px] text-xs font-bold 
                               bg-red-500 hover:bg-red-600 flex items-center justify-center 
                               rounded-full px-1.5 shadow-lg animate-pulse"
                    >
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-[#f38b00]/10 rounded-xl"
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#f38b00] to-[#ffed05] bg-clip-text text-transparent">
                      Menu
                    </DialogTitle>
                  </DialogHeader>
                  <nav className="flex flex-col gap-3 mt-4">
                    <div className="pb-3 border-b border-gray-200">
                      <AccountMenu />
                    </div>

                    <div className="pb-3 border-b border-gray-200">
                      <ToggleCategories />
                    </div>

                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center gap-4 p-4 rounded-xl 
                                   bg-gradient-to-r from-gray-50 to-white 
                                   hover:from-[#f38b00]/10 hover:to-[#ffed05]/10 
                                   transition-all duration-300 border-2 border-gray-100 
                                   hover:border-[#f38b00] hover:shadow-md"
                        >
                          <div className="p-3 rounded-xl bg-white shadow-sm 
                                        group-hover:bg-gradient-to-r group-hover:from-[#f38b00] 
                                        group-hover:to-[#ffed05] transition-all duration-300">
                            <Icon className="w-5 h-5 text-gray-700 group-hover:text-white" />
                          </div>
                          <span className="text-lg font-bold text-gray-900 group-hover:text-[#f38b00]">
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Desktop Only */}
      <div className="hidden md:block bg-white border-t border-gray-100">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center gap-2">
              {/* Home */}
              <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-gradient-to-br hover:from-[#f38b00]/10 hover:to-[#ffed05]/10
                           transition-all duration-300 group"
                >
                  <Home className="w-5 h-5 text-gray-600 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f38b00]">
                    Home
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-200" />

              {/* Categories */}
              <div className="flex items-center">
                <ToggleCategories />
              </div>

              <div className="h-6 w-px bg-gray-200" />

              {/* Products */}
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-gradient-to-br hover:from-[#f38b00]/10 hover:to-[#ffed05]/10
                           transition-all duration-300 group"
                >
                  <Package className="w-5 h-5 text-gray-600 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f38b00]">
                    Products
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-200" />

              {/* About */}
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-gradient-to-br hover:from-[#f38b00]/10 hover:to-[#ffed05]/10
                           transition-all duration-300 group"
                >
                  <Info className="w-5 h-5 text-gray-600 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f38b00]">
                    About
                  </span>
                </Button>
              </Link>
            </div>

            {/* Right: Featured Categories - Horizontal Layout */}
            <div className="flex items-center gap-4">
              {featuredCategories.length > 0 ? (
                featuredCategories.map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/products?category=${category.id}`}
                    className="group"
                  >
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gradient-to-br hover:from-[#f38b00]/10 hover:to-[#ffed05]/10 transition-all duration-300">
                      {/* Image/Icon First */}
                      {category.icon && !category.icon.startsWith('http') ? (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center group-hover:from-[#f38b00]/20 group-hover:to-[#ffed05]/20 transition-all duration-300 shadow-sm flex-shrink-0">
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                      ) : category.icon && category.icon.startsWith('http') ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 group-hover:from-[#f38b00]/20 group-hover:to-[#ffed05]/20 transition-all duration-300 shadow-sm flex-shrink-0">
                          <Image
                            src={category.icon}
                            alt={category.category_name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center group-hover:from-[#f38b00]/20 group-hover:to-[#ffed05]/20 transition-all duration-300 shadow-sm flex-shrink-0">
                          <Package className="w-5 h-5 text-gray-600 group-hover:text-[#f38b00]" />
                        </div>
                      )}
                      {/* Label Next */}
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f38b00] transition-colors whitespace-nowrap">
                        {category.category_name}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-xs text-gray-400 px-4">No featured categories</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </div>
  );
}
