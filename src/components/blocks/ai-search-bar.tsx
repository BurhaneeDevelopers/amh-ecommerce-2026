"use client";

import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useState, useCallback } from "react";

export default function AISearchBar() {
  const [value, setValue] = useState("");
  const placeholderText = useTypewriter({
    words: [
      "Ask about product specifications...",
      "Ask about warranty information...",
      "Ask about best tools for your project...",
      "Ask about maintenance tips...",
      "Ask me anything about our products...",
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetweenWords: 2000,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <div className="relative w-full max-w-2xl group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#f38b00] to-[#ffed05] rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300"></div>
      <div className="relative flex items-center bg-white rounded-full shadow-md overflow-hidden h-10 border-2 border-transparent bg-clip-padding" style={{
        backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #f38b00, #ffed05)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
        <Sparkles className="!w-4 !h-4 text-[#f38b00] ml-4 flex-shrink-0" />
        <div className="flex-1 relative px-3 h-10 flex items-center">
          {!value && (
            <div className="absolute inset-0 flex items-center pointer-events-none text-sm text-gray-400 left-2">
              {placeholderText}
              <span style={{ animation: 'blink 1s infinite' }}>|</span>
            </div>
          )}
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            className="w-full bg-transparent border-none !text-sm h-10 px-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
