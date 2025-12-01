"use client";

import { Menu, Search, Home, Package, BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../layout/container";
import { Li } from "../typography/typography";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ToggleCategories from "../blocks/toggle-categories";
import AccountMenu from "../layout/blocks/account-menu";
import AISearchBar from "../blocks/ai-search-bar";
import SearchBar from "../blocks/search-bar";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { current_user_auth_atom } from "@/jotai/store";
import { useGetWishlistByUser } from "@/api/wishlist.service";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAtomValue(current_user_auth_atom);
  const { data: wishlistData } = useGetWishlistByUser(user?.id ?? "");
  const wishlistCount = wishlistData?.length || 0;
  
  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Package },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];
  
  return (
    <NavigationMenu className="min-w-full sticky top-0 z-50 shadow-lg" viewport={false}>
      <Container className="bg-gradient-to-r from-[#272727] to-[#474747] text-white !py-3 w-full">
        <div className="mx-auto flex items-center justify-between gap-4 w-full">
          {/* Left: Logos */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <h5 className="text-white text-2xl md:text-3xl font-bold">MSI</h5>

            <Link href="/" className="hidden sm:block p-1.5 md:p-2 rounded-lg hover:shadow-lg transition-shadow">
              <Image
                alt="MSI Banner"
                src="/xlnt.png"
                width={500}
                height={500}
                className="object-cover w-20 h-6 md:w-32 md:h-10"
              />
            </Link>
          </div>

          {/* Center: Search Bars - Desktop */}
          <div className="hidden md:flex flex-1 justify-center px-4 gap-3">
            <SearchBar />
            <AISearchBar />
          </div>

          {/* Right: Nav Links + Actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Search Icon - Mobile */}
            <Button className="md:hidden bg-white/10 hover:bg-white/20 !p-2">
              <Search className="!w-5 !h-5" />
            </Button>

            {/* Nav Links - Desktop */}
            <nav className="hidden lg:flex gap-6 font-medium">
              {navLinks.map((link) => (
                <Li key={link.href}>
                  <Link
                    href={link.href}
                    className="relative text-sm hover:text-[#ffed05] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-[#f38b00] after:to-[#ffed05] after:w-0 after:opacity-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:opacity-100 after:origin-left"
                  >
                    {link.label}
                  </Link>
                </Li>
              ))}
            </nav>

            {/* Categories Button - Desktop */}
            <NavigationMenuList className="hidden md:block">
              <ToggleCategories />
            </NavigationMenuList>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button className="relative bg-white/10 hover:bg-white/20 h-10 w-10 p-0">
                <ShoppingCart className="!w-5 !h-5" />
                {wishlistCount > 0 && (
                  <Badge 
                    variant="destructive"
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold bg-red-500 hover:bg-red-600 flex items-center justify-center rounded-full px-1"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile */}
            <div className="hidden md:block">
              <AccountMenu />
            </div>

            {/* Mobile Menu Button */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="lg:hidden bg-gradient-to-tl from-[#f38b00] to-[#ffed05] text-white hover:opacity-90 !p-2">
                  <Menu className="!w-5 !h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
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
                        className="group flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#f38b00]/10 hover:to-[#ffed05]/10 transition-all duration-300 border border-gray-200 hover:border-[#f38b00] hover:shadow-md"
                      >
                        <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-gradient-to-r group-hover:from-[#f38b00] group-hover:to-[#ffed05] transition-all duration-300">
                          <Icon className="w-5 h-5 text-gray-700 group-hover:text-white" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900 group-hover:text-[#f38b00] transition-colors">
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
      </Container>
    </NavigationMenu>
  );
}
