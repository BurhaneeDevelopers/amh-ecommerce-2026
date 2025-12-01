"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTypewriter } from "@/hooks/useTypewriter";

export default function SearchBar() {
  const placeholderText = useTypewriter({
    words: [
      "Search for Cordless tools...",
      "Search for High Pressure Washer...",
      "Search for Compressors...",
      "Search for Accessories...",
      "Search for Spare parts...",
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetweenWords: 2000,
  });

  return (
    <div className="relative w-full max-w-2xl group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f38b00] to-[#ffed05] rounded-full opacity-20 group-hover:opacity-40 blur transition duration-300"></div>
      <div className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden h-10">
        <div className="flex-1 relative px-4 flex items-center">
          <Input
            type="text"
            placeholder={placeholderText}
            className="w-full bg-transparent border-none !text-sm h-10 px-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
          />
          <span 
            className="pointer-events-none text-gray-400 text-sm ml-0.5"
            style={{ animation: 'blink 1s infinite' }}
          >
            |
          </span>
        </div>
        <Button 
          className="rounded-full bg-gradient-to-r from-[#f38b00] to-[#ffed05] text-white hover:opacity-90 h-8 w-8 p-0 mr-1 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
        >
          <Search className="!w-4 !h-4" />
        </Button>
      </div>
    </div>
  );
}
