"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState, useCallback } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <div className="relative w-full max-w-xl group">
      <div className="relative flex items-center bg-white/10 hover:bg-white/20 rounded-full overflow-hidden h-10 transition-all duration-200">
        <div className="flex-1 relative px-4 h-10 flex items-center">
          {!value && (
            <div className="absolute inset-0 flex items-center pointer-events-none text-sm text-gray-300 left-4">
              {placeholderText}
              <span style={{ animation: 'blink 1s infinite' }}>|</span>
            </div>
          )}
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full bg-transparent border-none !text-sm h-10 px-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
          />
        </div>
        <Button 
          className="rounded-full bg-white/10 hover:bg-white/20 text-white h-8 w-8 p-0 mr-1 transition-all duration-300 flex items-center justify-center"
        >
          <Search className="!w-4 !h-4" />
        </Button>
      </div>
    </div>
  );
}
