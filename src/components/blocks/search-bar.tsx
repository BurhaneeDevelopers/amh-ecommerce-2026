"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState, useEffect } from "react";
import SearchModal from "./search-modal";

export default function SearchBar() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
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
    <>
      <div 
        className="relative w-full max-w-xl group cursor-pointer"
        onClick={() => setIsSearchModalOpen(true)}
      >
        <div className="relative flex items-center bg-white/10 hover:bg-white/20 rounded-full overflow-hidden h-10 transition-all duration-200">
          <div className="flex-1 relative px-4 h-10 flex items-center pointer-events-none">
            <div className="absolute inset-0 flex items-center text-sm text-gray-300 left-4">
              {placeholderText}
              <span style={{ animation: 'blink 1s infinite' }}>|</span>
            </div>
          </div>
          <Button 
            className="rounded-full bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0 mr-1 transition-all duration-300 flex items-center justify-center pointer-events-none"
          >
            <Search className="!w-4 !h-4" />
          </Button>
        </div>
      </div>

      <SearchModal 
        open={isSearchModalOpen} 
        onOpenChange={setIsSearchModalOpen} 
      />
    </>
  );
}
