import React from 'react'
import { Container } from '../layout/container'
import Image from 'next/image'
import { P } from '../typography/typography'
import { Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-[#1a1a1a] via-[#272727] to-[#1a1a1a] border-t-4 border-primary">
            <Container className="py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="bg-white p-3 w-fit rounded-lg shadow-lg">
                            <Image alt="MSI Industries" src={"/logo.png"} width={500} height={500} className="object-cover w-40 h-12" />
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed">
                            Leading supplier of industrial tools and equipment in Chennai. Quality products for professionals and DIY enthusiasts.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <div className="flex flex-col">
                                    <a href="tel:+918608818555" className="hover:text-primary transition-colors">
                                        +91 86088 18555
                                    </a>
                                    <a href="tel:+918248927038" className="hover:text-primary transition-colors">
                                        +91 82489 27038
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Mail className="w-4 h-4 text-primary" />
                                <a href="mailto:msindustries.chennai@gmail.com" className="hover:text-primary transition-colors">
                                    msindustries.chennai@gmail.com
                                </a>
                            </div>
                            <div className="flex items-start gap-2 text-gray-300 text-sm">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>Chennai, Tamil Nadu, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-4 relative inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
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
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
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
                            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
                        </h3>

                        <p className="text-gray-300 text-sm mb-4">
                            Subscribe to get special offers and updates
                        </p>

                        {/* Newsletter Form */}
                        <div className="flex flex-wrap lg:flex-nowrap gap-2 mb-6">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-gray-600 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">
                                Subscribe
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        <div className="space-y-3">
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Follow Us</p>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.instagram.com/msindustries.chennai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-primary p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group"
                                    aria-label="Follow us on Instagram"
                                >
                                    <FaInstagram className="w-5 h-5 text-gray-300 group-hover:text-gray-900" />
                                </a>
                                <a
                                    href="https://www.facebook.com/p/MS-Industries-100081911741796/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-primary p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group"
                                    aria-label="Follow us on Facebook"
                                >
                                    <FaFacebook className="w-5 h-5 text-gray-300 group-hover:text-gray-900" />
                                </a>
                                <a
                                    href="https://www.youtube.com/@MSINDUSTRIESCHENNAI01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-primary p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group"
                                    aria-label="Subscribe to our YouTube channel"
                                >
                                    <FaYoutube className="w-5 h-5 text-gray-300 group-hover:text-gray-900" />
                                </a>
                                <a
                                    href="https://in.linkedin.com/company/msindustries-tools"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-primary p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group"
                                    aria-label="Connect with us on LinkedIn"
                                >
                                    <FaLinkedin className="w-5 h-5 text-gray-300 group-hover:text-gray-900" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-400">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <P className="text-gray-400 text-sm text-center md:text-left">
                            &copy; 2025 MSI Industries. All rights reserved.
                        </P>
                        <div className="flex gap-6 text-sm">
                            <Link href="/sitemap" className="text-gray-400 hover:text-primary transition-colors">
                                Sitemap
                            </Link>
                            <Link href="/accessibility" className="text-gray-400 hover:text-primary transition-colors">
                                Accessibility
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-primary transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>

                    {/* Developer Watermark */}
                    <div className="mt-4 pt-4 text-center">
                        <P className="text-gray-300 text-xs">
                            Crafted with Love ❤️ By{' '}
                            <span className="text-primary font-medium hover:text-secondary transition-colors cursor-default">
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