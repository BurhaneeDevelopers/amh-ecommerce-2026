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
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import { useGetWishlistByUser } from "@/api/wishlist.service";
import { useGetAllBrands } from "@/api/brand.service";
import { P } from "../typography/typography";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const user = useAtomValue(current_user_auth_atom);
  const { data: wishlistData } = useGetWishlistByUser(user?.id ?? "");
  const wishlistCount = wishlistData?.length || 0;
  const { data: allBrands = [] } = useGetAllBrands();

  // Get top 5 brands (you can add a featured flag to Brand schema if needed)
  const featuredBrands = allBrands.slice(0, 5);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Package },
    { label: "About", href: "/about", icon: Info },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];

  return (
    <div className="min-w-full sticky top-0 z-50 bg-[#2d2d2d] border-b border-gray-700 shadow-lg">
      {/* Main Navbar */}
      <div className="bg-[#2d2d2d]">
        <div className="w-full">
          <div className="flex items-center justify-between h-20 px-4 lg:px-6 overflow-hidden">
            {/* Left: Logo - Much Larger */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="relative flex gap-4">
                <Image
                  alt="MSI Logo"
                  src="/msi-logo-white.png"
                  width={500}
                  height={500}
                  className="object-cover scale-150 h-20 p-2 w-36 transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <Image
                  alt="MSI Logo"
                  src="/xlnt.png"
                  width={500}
                  height={500}
                  className="object-cover scale-150 h-20 p-2 w-full transition-transform duration-300 group-hover:scale-105"
                  priority
                />
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
                  className="w-full pl-12 pr-4 py-4 text-sm font-medium bg-white/10 border-2 border-gray-600 rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-[#f38b00] focus:border-transparent 
                           hover:border-[#f38b00]/40 hover:shadow-md text-white placeholder:text-gray-400
                           transition-all duration-300"
                  onClick={() => setIsSearchModalOpen(true)}
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded">
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
                className="lg:hidden hover:bg-white/10 rounded-xl"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="w-5 h-5 text-gray-300" />
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
                    className="md:hidden hover:bg-white/10 rounded-xl"
                  >
                    <Menu className="w-6 h-6 text-gray-300" />
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
      <div className="hidden md:block bg-[#3a3a3a] border-t border-gray-700">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center gap-2">
              {/* Home */}
              <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white/10
                           transition-all duration-300 group"
                >
                  <Home className="w-5 h-5 text-gray-300 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-[#f38b00]">
                    Home
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-600" />

              {/* Categories */}
              <div className="flex items-center">
                <ToggleCategories />
              </div>

              <div className="h-6 w-px bg-gray-600" />

              {/* Products */}
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white/10
                           transition-all duration-300 group"
                >
                  <Package className="w-5 h-5 text-gray-300 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-[#f38b00]">
                    Products
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-600" />

              {/* About */}
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white/10
                           transition-all duration-300 group"
                >
                  <Info className="w-5 h-5 text-gray-300 group-hover:text-[#f38b00] transition-colors" />
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-[#f38b00]">
                    About
                  </span>
                </Button>
              </Link>
            </div>

            {/* Right: Featured Brands - Responsive Layout */}
            <div className="flex items-center overflow-x-auto scrollbar-hide max-w-[50%] lg:max-w-[60%] xl:max-w-none">
              {featuredBrands.length > 0 ? (
                featuredBrands.map((brand) => (
                  <Link 
                    key={brand.id} 
                    href={`/category/all?brand=${brand.id}`}
                    className="group flex-shrink-0"
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 px-2 lg:px-2.5 py-1.5 lg:py-2 rounded-xl hover:bg-white/10 transition-all duration-300 min-w-[60px] lg:min-w-0">
                      {/* Brand Logo */}
                      {brand.brand_logo ? (
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg overflow-hidden bg-white group-hover:bg-gray-100 transition-all duration-300 shadow-sm flex-shrink-0 flex items-center justify-center p-1">
                          <Image
                            src={brand.brand_logo}
                            alt={brand.brand_name}
                            width={36}
                            height={36}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-all duration-300 shadow-sm flex-shrink-0">
                          <Package className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-[#f38b00]" />
                        </div>
                      )}
                      {/* Brand Name - Responsive sizing and wrapping */}
                      <P className="text-[10px] xl:text-sm font-semibold text-gray-300 group-hover:text-[#f38b00] transition-colors text-center lg:text-left leading-tight max-w-20 xl:max-w-full">
                        {brand.brand_name}
                      </P>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-xs text-gray-500 px-4">No featured brands</div>
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
