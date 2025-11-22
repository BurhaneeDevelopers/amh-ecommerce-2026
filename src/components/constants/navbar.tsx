"use client";

import { Menu, Search, Home, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Products", href: "/products", icon: Package },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];
  
  return (
    <NavigationMenu className="min-w-full" viewport={false}>
      <Container className="bg-[#272727] text-white !py-2 md:!py-4 w-full">
        <div className="mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 md:gap-4 w-full">
          {/* Left: Category Button with dropdown */}
          <NavigationMenuList>
            <ToggleCategories />
          </NavigationMenuList>

          {/* Center: Nav Links - Desktop */}
          <nav className="hidden lg:flex flex-wrap gap-4 justify-evenly w-full font-medium max-w-screen-lg">
            {navLinks.map((link) => (
              <Li key={link.href}>
                <Link
                  href={link.href}
                  className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-white after:w-0 after:opacity-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:opacity-100 after:origin-left"
                >
                  {link.label}
                </Link>
              </Li>
            ))}
          </nav>

          {/* Mobile Menu Modal */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black !py-2 !px-3 lg:hidden hover:bg-gray-100">
                <Menu className="!w-5 !h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-[#f38b00] to-[#ffed05] bg-clip-text text-transparent">
                  Navigation Menu
                </DialogTitle>
              </DialogHeader>
              <nav className="flex flex-col gap-3 mt-6">
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

          {/* Right: Search */}
          <div className="flex items-center w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search..."
              className="bg-white rounded-e-none w-full flex-grow lg:!w-80 !text-sm md:!text-base !py-5 md:!py-7 outline-none border-none"
            />
            <Button className="rounded-s-none bg-gradient-to-tl from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-5 md:!py-7 !px-3 md:!px-4">
              <Search className="!w-5 !h-5 md:!w-7 md:!h-7" />
            </Button>
          </div>
        </div>
      </Container>
    </NavigationMenu>
  );
}
