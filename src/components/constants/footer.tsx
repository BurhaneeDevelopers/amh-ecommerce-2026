import React from 'react'
import { Container } from '../layout/container'
import { P } from '../typography/typography'
import { Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-[#2d2d2d] border-t-4 border-[#ff6b35]">
            <Container className="py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="bg-white p-4 w-fit rounded-lg shadow-lg">
                            <img 
                                src="/logo.png" 
                                alt="A.M. Hydraulics" 
                                className="h-10 w-auto object-contain"
                            />
                        </div>

                        <p className="text-[#e0d4f7] text-sm leading-relaxed">
                            Leading manufacturer & distributor of hydraulic hoses and fittings in Chennai. Authorized stockist for top brands.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-[#e0d4f7] text-sm">
                                <Phone className="w-4 h-4 text-[#ff6b35]" />
                                <div className="flex flex-col">
                                    <a href="tel:+919884369751" className="hover:text-[#ff6b35] transition-colors">
                                        +91 98843 69751
                                    </a>
                                    <a href="tel:04442161198" className="hover:text-[#ff6b35] transition-colors">
                                        044 42161198
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[#e0d4f7] text-sm">
                                <Mail className="w-4 h-4 text-[#ff6b35]" />
                                <a href="mailto:info@amhat.com" className="hover:text-[#ff6b35] transition-colors">
                                    info@amhat.com
                                </a>
                            </div>
                            <div className="flex items-start gap-2 text-[#e0d4f7] text-sm">
                                <MapPin className="w-4 h-4 text-[#ff6b35] mt-0.5 flex-shrink-0" />
                                <span>148, Angappa Naicken Street, Parrys Corner, Chennai - 600001</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#ff6b35]"></span>
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="text-[#e0d4f7] hover:text-[#ff6b35] transition-colors hover:translate-x-1 inline-block">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Wishlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 relative inline-block">
                            Customer Service
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#ff6b35]"></span>
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {/* <li>
                                <Link href="/delivery-info" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Delivery Information
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    Terms & Conditions
                                </Link>
                            </li> */}
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 relative inline-block">
                            Stay Connected
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-[#ff6b35]"></span>
                        </h3>

                        <p className="text-white/90 text-sm mb-4">
                            Subscribe to get special offers and updates
                        </p>

                        {/* Newsletter Form */}
                        <div className="flex flex-wrap lg:flex-nowrap gap-2 mb-6">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-[#4a4a4a] text-white text-sm placeholder:text-[#9b9b9b] focus:outline-none focus:border-[#ff6b35] transition-colors"
                            />
                            <button className="px-4 py-2 bg-[#ff6b35] hover:bg-[#e55a25] text-white font-semibold rounded-lg transition-all text-sm">
                                Subscribe
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        <div className="space-y-3">
                            <p className="text-[#9b9b9b] text-xs font-medium uppercase tracking-wider">Follow Us</p>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.am-hydraulics.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-[#ff6b35] p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group"
                                    aria-label="Visit our website"
                                >
                                    <FaInstagram className="w-5 h-5 text-[#e0d4f7] group-hover:text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[#4a4a4a]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <P className="text-[#9b9b9b] text-sm text-center md:text-left">
                            &copy; 2025 A.M. Hydraulics and Tubes. All rights reserved.
                        </P>
                        <div className="flex gap-6 text-sm">
                            <Link href="/sitemap" className="text-[#9b9b9b] hover:text-[#ff6b35] transition-colors">
                                Sitemap
                            </Link>
                            <Link href="/accessibility" className="text-[#9b9b9b] hover:text-[#ff6b35] transition-colors">
                                Accessibility
                            </Link>
                            <Link href="/cookies" className="text-[#9b9b9b] hover:text-[#ff6b35] transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>

                    {/* Developer Watermark */}
                    <div className="mt-4 pt-4 text-center">
                        <P className="text-[#6b6b6b] text-xs">
                            Crafted with Love ❤️ By{' '}
                            <span className="text-[#ff6b35] font-medium hover:text-[#e55a25] transition-colors cursor-default">
                                Taheri Developers
                            </span>
                        </P>
                    </div>
                </div>
            </Container>
        </footer>
    )
}

export default Footer