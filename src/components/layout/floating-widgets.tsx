'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUp, 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  CornerDownLeft, 
  User,
  Sparkles,
  HelpCircle,
  PhoneCall,
  CheckCircle,
  FileText
} from 'lucide-react'

// Define Message types
interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

// Preset suggestions
const SUGGESTIONS = [
  { id: '1', text: '🔍 What products do you offer?', query: 'products' },
  { id: '2', text: '🌀 Tell me about your Spiral Hoses', query: 'spiral hoses' },
  { id: '3', text: '🔩 Do you have Metric Fittings?', query: 'metric fittings' },
  { id: '4', text: '⚙️ Which brands do you stock?', query: 'brands' },
  { id: '5', text: '📋 How do I choose the right hose?', query: 'choose hose' },
  { id: '6', text: '📞 How can I contact sales?', query: 'contact' },
]

export const FloatingWidgets = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! 👋 I'm your **A.M. Hydraulics AI Assistant** (powered by Claude).\n\nI can help you find high-quality hydraulic hoses, fittings, adaptors, and brands, or guide you in selecting the right specs. \n\nHow can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(true)
  const [showChatTooltip, setShowChatTooltip] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Listen to scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  // Automatically hide tooltips after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWhatsAppTooltip(false)
      setShowChatTooltip(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppRedirect = () => {
    // Official sales number format: +91 (India) 98843 69751
    const phoneNumber = '919884369751'
    const message = encodeURIComponent('Hello A.M. Hydraulics! I would like to inquire about your hydraulic hoses and fittings.')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  // Local knowledge lookup response engine
  const getAIResponse = (query: string): string => {
    const cleanQuery = query.toLowerCase().trim()

    // 1. PRODUCTS GENERAL
    if (cleanQuery.includes('product') || cleanQuery.includes('offer') || cleanQuery.includes('sell') || cleanQuery.includes('catalog')) {
      return `At **A.M. Hydraulics**, we manufacture and distribute a complete range of fluid transfer solutions:
      
• **Hydraulic Hoses**: Braided Hoses (EN 853 1SN/2SN), Spiral Hoses (EN 856 4SP/4SH), Textile Hoses, and PTFE chemical-resistant hoses.
• **Hose Fittings**: Metric Fittings (DKL, DKOL, DKOS with O-rings), BSP, and JIC 37° flare fittings.
• **Industrial Hoses**: For compressed air, water, steam, and chemical transfer.
• **Quick Couplings**: Threaded & quick-release couplings.
• **Precision Tubes**: Cold-drawn seamless steel and stainless steel tubes.
• **Valves & Flanges**: High-pressure 2-way/3-way ball valves, and SAE/ISO flanges.

Would you like more details about a specific category?`
    }

    // 2. SPIRAL HOSES
    if (cleanQuery.includes('spiral') || cleanQuery.includes('high pressure') || cleanQuery.includes('en 856') || cleanQuery.includes('en856') || cleanQuery.includes('4sp') || cleanQuery.includes('4sh')) {
      return `Our **Spiral Wire Hydraulic Hoses (EN 856)** are designed for extremely high-pressure, severe-impulse applications:

1. **Spiral Hose EN 856 4SP - DN 10 / 12**:
   - *Reinforcement*: 4 high-tensile steel wire spirals.
   - *Working Pressure*: Up to **420 bar** (for DN 10) and **400 bar** (for DN 12).
   - *Application*: Heavy-duty industrial and excavation machinery.
2. **Spiral Hose EN 856 4SH - DN 25**:
   - *Reinforcement*: 4 high-tensile steel wire spirals.
   - *Working Pressure*: Up to **350 bar**.
   - *Application*: High-impulse applications demanding maximum fatigue life.

Would you like me to recommend matching fittings for these spiral hoses?`
    }

    // 3. METRIC FITTINGS / FITTINGS
    if (cleanQuery.includes('fitting') || cleanQuery.includes('metric') || cleanQuery.includes('dkol') || cleanQuery.includes('dkos') || cleanQuery.includes('thread') || cleanQuery.includes('bsp') || cleanQuery.includes('jic')) {
      return `We provide premium precision leak-free hydraulic connectors:

• **Metric Fittings**:
  - **DKOL**: Metric Light Series (e.g., M16x1.5 straight female with O-ring, ideal for medium pressure).
  - **DKOS**: Metric Heavy Series (e.g., M22x1.5 90° elbow with O-ring, ideal for high-pressure spiral hoses).
• **BSP Fittings**: British Standard Pipe threads for classic and European systems.
• **JIC Fittings**: 37-degree flare fittings conforming to SAE J514.

We supply these in straight, 45° elbow, and 90° elbow configurations. What thread size are you looking for?`
    }

    // 4. BRANDS
    if (cleanQuery.includes('brand') || cleanQuery.includes('manufacturer') || cleanQuery.includes('stockist') || cleanQuery.includes('parker') || cleanQuery.includes('hansa') || cleanQuery.includes('eaton') || cleanQuery.includes('stauff') || cleanQuery.includes('ktr')) {
      return `We are authorized distributors and stockists for world-class, certified fluid technology brands:

• **HANSA-FLEX** (Germany): Globally certified hydraulic hoses, fittings, and adapters.
• **Parker Hannifin**: Global standard in premium motion-control fittings and hoses.
• **Eaton (Vickers)**: Premium-grade hoses and power transmission systems.
• **Stauff**: Premium tube clamps, flanges, test points, and diagnostic equipment.
• **KTR**: High-performance drive couplings and shaft connections.

All brands come with official certifications and test records.`
    }

    // 5. CHOOSE HOSE (STAMPED METHOD)
    if (cleanQuery.includes('choose') || cleanQuery.includes('select') || cleanQuery.includes('stamped') || cleanQuery.includes('find') || cleanQuery.includes('size')) {
      return `To select the correct hydraulic hose, we recommend using the industry-standard **S.T.A.M.P.E.D.** criteria:

1. **S**ize: Internal diameter (ID), outer diameter (OD), and length.
2. **T**emperature: Temperature of the fluid inside and the environment outside.
3. **A**pplication: Where it will be used (routing, bend radius, impulse frequency).
4. **M**aterial: Compatibility of fluid with the hose tube, cover, and fittings.
5. **P**ressure: Max working pressure (ensure the hose is rated equal or higher than system spikes).
6. **E**nds: Fitting style, thread type (Metric, BSP, JIC), and sealing shape.
7. **D**elivery: Quantity required, packaging, and testing requirements.

If you share these details with us, our engineering team can select and assemble the perfect hose for you!`
    }

    // 6. CONTACT / SALES / ADDRESS
    if (cleanQuery.includes('contact') || cleanQuery.includes('phone') || cleanQuery.includes('email') || cleanQuery.includes('address') || cleanQuery.includes('location') || cleanQuery.includes('chennai') || cleanQuery.includes('support') || cleanQuery.includes('map')) {
      return `You can get in touch with our sales and technical team immediately:

• 🏢 **Office & Warehouse**: A.M. Hydraulics & Tubes, Chennai, Tamil Nadu, India.
• 📞 **Phone / WhatsApp**: [+91 98843 69751](tel:+919884369751) (Immediate response)
• ✉️ **Email**: info@amhat.com
• ⏱️ **Hours**: Monday – Saturday: 9:00 AM – 7:30 PM

Feel free to click the **WhatsApp** widget on the bottom left of your screen for a direct instant chat with our engineering desk!`
    }

    // 7. PRICE / QUOTE / ENQUIRY
    if (cleanQuery.includes('price') || cleanQuery.includes('quote') || cleanQuery.includes('cost') || cleanQuery.includes('buy') || cleanQuery.includes('order')) {
      return `We provide competitive custom quotes tailored to your industrial requirements. 

To request pricing:
1. Click the **WhatsApp** icon on the bottom left for instant quotes.
2. Email us your BOM (Bill of Materials) at **info@amhat.com**.
3. Fill out the enquiry form on our **Contact** page.

Please specify the hose inner diameter, pressure rating, and fitting thread sizes for faster turnaround!`
    }

    // DEFAULT FALLBACK
    return `Thank you for asking! I'm here to assist with A.M. Hydraulics products. 

Could you specify if you are looking for:
• **High-Pressure Hoses** (Spiral or Braided)
• **Hose Fittings & Adapters** (Metric/DKOL/DKOS, BSP, JIC)
• **Brand Availability** (Parker, HANSA-FLEX, Eaton)
• **Technical/STAMPED Assistance**

Alternatively, you can chat directly with a live representative via the WhatsApp widget on the left!`
  }

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Show typing state
    setIsTyping(true)

    // Simulate response delay
    setTimeout(() => {
      const responseText = getAIResponse(text)
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1200)
  }

  // Simple helper to format bold syntax and bullet points in text
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      let content: React.ReactNode = line

      // Handle bold texts like **text**
      const boldRegex = /\*\*(.*?)\*\*/g
      if (boldRegex.test(line)) {
        const parts = line.split(boldRegex)
        content = parts.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part}</strong>
          }
          return part
        })
      }

      // Check if it's a bullet point
      const bulletRegex = /^[•\-]\s*(.*)/
      const match = line.match(bulletRegex)
      if (match) {
        let innerText: React.ReactNode = match[1]
        // Re-apply bold styling inside bullet points if present
        if (boldRegex.test(match[1])) {
          const parts = match[1].split(boldRegex)
          innerText = parts.map((part, index) => {
            if (index % 2 === 1) {
              return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part}</strong>
            }
            return part
          })
        }
        return (
          <li key={i} className="ml-4 list-disc pl-1 my-0.5 text-sm leading-relaxed">
            {innerText}
          </li>
        )
      }

      // Handle numbered lists e.g. 1. text
      const numberRegex = /^(\d+)\.\s*(.*)/
      const numMatch = line.match(numberRegex)
      if (numMatch) {
        let innerText: React.ReactNode = numMatch[2]
        if (boldRegex.test(numMatch[2])) {
          const parts = numMatch[2].split(boldRegex)
          innerText = parts.map((part, index) => {
            if (index % 2 === 1) {
              return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part}</strong>
            }
            return part
          })
        }
        return (
          <div key={i} className="ml-2 flex items-start gap-1.5 my-1 text-sm leading-relaxed">
            <span className="font-medium text-primary shrink-0">{numMatch[1]}.</span>
            <span>{innerText}</span>
          </div>
        )
      }

      return (
        <p key={i} className={line.trim() === '' ? 'h-2' : 'my-1 text-sm leading-relaxed whitespace-pre-wrap'}>
          {content}
        </p>
      )
    })
  }

  return (
    <>
      {/* ========================================== */}
      {/* 1. WHATSAPP REDIRECT WIDGET (BOTTOM LEFT)  */}
      {/* ========================================== */}
      <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3">
        {/* Clickable animated widget button */}
        <motion.button
          onClick={handleWhatsAppRedirect}
          className="bg-[#25D366] hover:bg-[#1ebd59] text-white p-4 rounded-full shadow-2xl hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] flex items-center justify-center relative outline-none"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.94 }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 10px 20px rgba(37,211,102,0.2)",
              "0 10px 30px rgba(37,211,102,0.4)",
              "0 10px 20px rgba(37,211,102,0.2)"
            ]
          }}
          transition={{
            scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            boxShadow: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
        >
          {/* Pulsing Outer Ring */}
          <span className="absolute -inset-1 rounded-full border-2 border-[#25D366] opacity-30 animate-ping pointer-events-none" />

          {/* SVG WhatsApp icon */}
          <svg className="w-7 h-7 filter drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </motion.button>

        {/* Hover / Auto-Triggered Message Box */}
        <AnimatePresence>
          {showWhatsAppTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2 max-w-xs relative pointer-events-auto"
            >
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">WhatsApp Support</span>
                <span className="text-sm font-medium leading-tight">Need instant pricing? Chat with us!</span>
              </div>
              <button 
                onClick={() => setShowWhatsAppTooltip(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 ml-2 self-start rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              
              {/* Little triangle arrow facing left */}
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white dark:border-r-gray-800 filter drop-shadow-[-2px_0_1px_rgba(0,0,0,0.03)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================== */}
      {/* 2. AI CHATBOT WIDGET (BOTTOM RIGHT)        */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {/* Scroll-To-Top Button stacked above Chat Widget */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              className="bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md outline-none focus:ring-2 focus:ring-primary/40"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-gray-900 w-[92vw] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden backdrop-blur-3xl"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-[#ff6b35] via-[#ff7c4d] to-[#8b5cf6] text-white p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/10 relative">
                    <Bot className="w-6 h-6 text-white" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-base leading-tight tracking-wide flex items-center gap-1.5">
                      AMH Assistant
                      <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">Claude PROT</span>
                    </h3>
                    <span className="text-xs text-white/85 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Ask us about hoses & fittings
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20 scrollbar-thin">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot avatar */}
                    {msg.sender === 'bot' && (
                      <div className="bg-gradient-to-br from-[#ff6b35] to-[#8b5cf6] text-white p-1.5 rounded-lg shrink-0 shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="flex flex-col max-w-[80%] gap-1">
                      <div 
                        className={`px-4 py-3 rounded-2xl shadow-sm text-sm font-sans ${
                          msg.sender === 'user' 
                            ? 'bg-[#ff6b35] text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700/50 rounded-tl-sm'
                        }`}
                      >
                        {renderMessageText(msg.text)}
                      </div>
                      
                      {/* Short action buttons for Bot messages with specific links */}
                      {msg.sender === 'bot' && msg.id === 'welcome' && (
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <button 
                            onClick={handleWhatsAppRedirect}
                            className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 px-2.5 py-1 rounded-full border border-green-200/50 flex items-center gap-1 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3" /> Chat Live
                          </button>
                          <a 
                            href="/products" 
                            className="text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-full border border-primary/10 flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" /> Browse Products
                          </a>
                        </div>
                      )}

                      {/* Timestamp */}
                      <span className={`text-[10px] text-gray-400 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* User avatar */}
                    {msg.sender === 'user' && (
                      <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 p-1.5 rounded-lg shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2.5 justify-start">
                    <div className="bg-gradient-to-br from-[#ff6b35] to-[#8b5cf6] text-white p-1.5 rounded-lg shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Panel */}
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 flex gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap mask-gradient">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSend(suggestion.text.replace(/^[^\s]+\s+/, ''))}
                    className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-[#ff6b35] dark:hover:text-[#ff6b35] hover:border-[#ff6b35]/40 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 font-sans cursor-pointer"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-white dark:bg-gray-900"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask AMH Assistant..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm px-4 py-2.5 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder-gray-400 font-sans"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className={`p-2.5 rounded-xl shadow-md flex items-center justify-center transition-all ${
                    inputValue.trim()
                      ? 'bg-gradient-to-r from-[#ff6b35] to-[#8b5cf6] text-white hover:opacity-95 hover:scale-105 active:scale-95'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Float bubble triggers chatbot window */}
        <div className="flex items-center gap-3">
          {/* Tooltip on Hover / Delay */}
          <AnimatePresence>
            {showChatTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 15, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2 max-w-xs relative pointer-events-auto"
              >
                <Sparkles className="w-4 h-4 text-[#ff6b35] shrink-0 animate-pulse" />
                <span className="text-sm font-medium leading-tight">Got questions? Chat with AI!</span>
                <button 
                  onClick={() => setShowChatTooltip(false)} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 ml-2 self-start rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Little triangle arrow facing right */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white dark:border-l-gray-800 filter drop-shadow-[2px_0_1px_rgba(0,0,0,0.03)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowChatTooltip(false);
            }}
            className={`p-4 rounded-full shadow-2xl flex items-center justify-center text-white outline-none ${
              isOpen 
                ? 'bg-gray-900 hover:bg-gray-800 hover:shadow-xl shadow-none' 
                : 'bg-gradient-to-r from-[#ff6b35] to-[#ff7d4e] hover:shadow-[0_10px_25px_rgba(255,107,53,0.4)]'
            }`}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            animate={!isOpen ? {
              y: [0, -4, 0],
            } : {}}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
          </motion.button>
        </div>
      </div>
    </>
  )
}
