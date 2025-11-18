"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Container } from "../layout/container";
import { Li } from "../typography/typography";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import ToggleCategories from "../blocks/toggle-categories";

export default function Navbar() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];
  return (
    <NavigationMenu className="min-w-full" viewport={false}>
      <Container className="bg-[#272727] text-white !py-4 w-full">
        <div className="mx-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 w-full">
          {/* Left: Category Button with dropdown */}
          <NavigationMenuList>
            <ToggleCategories />
          </NavigationMenuList>

          {/* Center: Nav Links */}
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

          {/* Mobile Menu Icon */}
          <Button className="bg-white text-black !py-7 !px-4 lg:hidden">
            <Menu className="!w-8 !h-8" />
          </Button>

          {/* Right: Search */}
          <div className="flex items-center w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search here..."
              className="bg-white rounded-e-none w-full flex-grow lg:!w-80 !text-base !py-7 outline-none border-none"
            />
            <Button className="rounded-s-none bg-gradient-to-tl from-[#f38b00] to-[#ffeD05] text-white hover:bg-[#fcb031]/90 !py-7 !px-4">
              <Search className="!w-7 !h-7" />
            </Button>
          </div>
        </div>
      </Container>
    </NavigationMenu>
  );
}
