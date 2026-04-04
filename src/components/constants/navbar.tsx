"use client";

import { Menu, Search, Home, Package, BookOpen, Info, ShoppingCart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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

  // Get top 5 brands sorted by order (lowest first)
  const featuredBrands = allBrands
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .slice(0, 5);

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
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <div className="min-w-full sticky top-0 z-50 bg-white border-b border-[#e0d4f7] shadow-md">
      {/* Main Navbar */}
      <div className="bg-white">
        <div className="w-full">
          <div className="flex items-center justify-between h-20 px-4 lg:px-6 overflow-hidden">
            {/* Left: Company Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="relative h-12 w-auto">
                <img 
                  src="/logo.png" 
                  alt="A.M. Hydraulics" 
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Center: Enhanced Search Bar */}
            <div className="hidden lg:flex flex-1 mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-[#6b6b6b] group-hover:text-[#ff6b35] transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  placeholder='Search for "Hydraulic Hoses", "Fittings", "Pumps"...'
                  className="w-full pl-12 pr-4 py-4 text-sm font-medium bg-[#fef5f0] border-2 border-[#e0d4f7] rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent 
                           hover:border-[#ff6b35]/40 hover:shadow-md text-[#2d2d2d] placeholder:text-[#6b6b6b]
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
                className="lg:hidden hover:bg-[#fef5f0] rounded-xl text-[#2d2d2d]"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Sign In / Account - Desktop */}
              <div className="hidden md:block">
                <AccountMenu />
              </div>

              {/* My Cart Button - Prominent */}
              <Link href="/wishlist">
                <Button 
                  size="lg"
                  className="relative gap-2.5 rounded-2xl bg-[#ff6b35] hover:bg-[#e55a25] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-6 text-base"
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
                    className="md:hidden hover:bg-[#fef5f0] rounded-xl text-[#2d2d2d]"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-[#8b5cf6]">
                      Menu
                    </DialogTitle>
                  </DialogHeader>
                  <nav className="flex flex-col gap-3 mt-4">
                    <div className="pb-3 border-b border-[#e0d4f7]">
                      <AccountMenu />
                    </div>

                    <div className="pb-3 border-b border-[#e0d4f7]">
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
                                   bg-white hover:bg-[#fff0e8] 
                                   transition-all duration-300 border-2 border-[#e0d4f7] 
                                   hover:border-[#ff6b35] hover:shadow-md"
                        >
                          <div className="p-3 rounded-xl bg-white shadow-sm 
                                        group-hover:bg-[#ff6b35] transition-all duration-300">
                            <Icon className="w-5 h-5 text-[#4a4a4a] group-hover:text-white" />
                          </div>
                          <span className="text-lg font-bold text-[#2d2d2d] group-hover:text-[#ff6b35]">
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
      <div className="hidden md:block bg-[#fef5f0] border-t border-[#e0d4f7]">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Left: Main Navigation Links */}
            <div className="flex items-center gap-2">
              {/* Home */}
              <Link href="/">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white
                           transition-all duration-300 group"
                >
                  <Home className="w-5 h-5 text-[#4a4a4a] group-hover:text-[#ff6b35] transition-colors" />
                  <span className="text-sm font-semibold text-[#4a4a4a] group-hover:text-[#ff6b35]">
                    Home
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-[#c084fc]" />

              {/* Products */}
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white
                           transition-all duration-300 group"
                >
                  <Package className="w-5 h-5 text-[#4a4a4a] group-hover:text-[#ff6b35] transition-colors" />
                  <span className="text-sm font-semibold text-[#4a4a4a] group-hover:text-[#ff6b35]">
                    Products
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-[#c084fc]" />

              {/* About */}
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white
                           transition-all duration-300 group"
                >
                  <Info className="w-5 h-5 text-[#4a4a4a] group-hover:text-[#ff6b35] transition-colors" />
                  <span className="text-sm font-semibold text-[#4a4a4a] group-hover:text-[#ff6b35]">
                    About
                  </span>
                </Button>
              </Link>

              <div className="h-6 w-px bg-[#c084fc]" />

              {/* Contact */}
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto py-2.5 px-5 rounded-xl
                           hover:bg-white
                           transition-all duration-300 group"
                >
                  <Mail className="w-5 h-5 text-[#4a4a4a] group-hover:text-[#ff6b35] transition-colors" />
                  <span className="text-sm font-semibold text-[#4a4a4a] group-hover:text-[#ff6b35]">
                    Contact
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
                          <img
                            src={brand.brand_logo}
                            alt={brand.brand_name}
                            className="w-full h-full object-contain"
                            loading="lazy" decoding="async" width={500} height={300}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-white flex items-center justify-center group-hover:bg-[#fff0e8] transition-all duration-300 shadow-sm flex-shrink-0 border border-[#e0d4f7]">
                          <Package className="w-4 h-4 lg:w-5 lg:h-5 text-[#6b6b6b] group-hover:text-[#ff6b35]" />
                        </div>
                      )}
                      {/* Brand Name - Responsive sizing and wrapping */}
                      <P className="text-[10px] xl:text-sm font-semibold text-[#4a4a4a] group-hover:text-[#ff6b35] transition-colors text-center lg:text-left leading-tight max-w-20 xl:max-w-full">
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
