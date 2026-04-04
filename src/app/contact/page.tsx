import { Container } from "@/components/layout/container";
import { H1, H2, H3, P } from "@/components/typography/typography";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-yellow-50/30">
            {/* Hero Section with Modern Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b35] via-[#e55a25] to-[#ff6b35] text-white py-20">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            Contact Us
                        </H1>
                        <P className="text-xl text-white/90 leading-relaxed">
                            Get in touch with us for all your hydraulic needs
                        </P>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Contact Form and Info Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/60 hover:shadow-xl transition-shadow">
                            <H2 className="text-3xl font-bold mb-6 text-[#2d2d2d]">
                                Send us a Message
                            </H2>
                            <P className="text-[#6b6b6b] mb-8">
                                Fill out the form below and we&apos;ll get back to you as soon as possible.
                            </P>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-[#2d2d2d] font-semibold">
                                            First Name *
                                        </Label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            className="border-[#e0d4f7] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-[#2d2d2d] font-semibold">
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            className="border-[#e0d4f7] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#2d2d2d] font-semibold">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        className="border-[#e0d4f7] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[#2d2d2d] font-semibold">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 98843 69751"
                                        className="border-[#e0d4f7] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-[#2d2d2d] font-semibold">
                                        Subject *
                                    </Label>
                                    <Input
                                        id="subject"
                                        placeholder="Product Inquiry"
                                        className="border-[#e0d4f7] focus:border-[#ff6b35] focus:ring-[#ff6b35]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-[#2d2d2d] font-semibold">
                                        Message *
                                    </Label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        placeholder="Tell us about your requirements..."
                                        className="w-full px-3 py-2 border border-[#e0d4f7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent resize-none"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#ff6b35] hover:bg-[#e55a25] text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        {/* Quick Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200/60 hover:shadow-xl transition-shadow">
                                <H2 className="text-2xl font-bold mb-6 text-[#2d2d2d]">
                                    Quick Contact
                                </H2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gradient-to-br from-[#ff6b35] to-[#e55a25] p-3 rounded-lg shadow-md">
                                            <Phone className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <P className="font-semibold text-[#2d2d2d] mb-1">Phone</P>
                                            <a href="tel:+919884369751" className="text-[#6b6b6b] hover:text-[#ff6b35] transition-colors block">
                                                +91 98843 69751
                                            </a>
                                            <a href="tel:04442161198" className="text-[#6b6b6b] hover:text-[#ff6b35] transition-colors block">
                                                044 42161198
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] p-3 rounded-lg shadow-md">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <P className="font-semibold text-[#2d2d2d] mb-1">Email</P>
                                            <a href="mailto:info@amhat.com" className="text-[#6b6b6b] hover:text-[#ff6b35] transition-colors">
                                                info@amhat.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-gradient-to-br from-[#a855f7] to-[#9333ea] p-3 rounded-lg shadow-md">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <P className="font-semibold text-[#2d2d2d] mb-1">Business Hours</P>
                                            <P className="text-[#6b6b6b]">Monday - Saturday: 9:00 AM - 6:00 PM</P>
                                            <P className="text-[#6b6b6b]">Sunday: Closed</P>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gradient-to-br from-[#ff6b35] to-[#e55a25] p-8 rounded-2xl shadow-lg text-white">
                                <H3 className="text-xl font-bold mb-4 text-white">
                                    Why Choose Us?
                                </H3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-1">✓</span>
                                        <P className="text-white/90">Authorized stockist for leading brands</P>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-1">✓</span>
                                        <P className="text-white/90">Expert technical support</P>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-1">✓</span>
                                        <P className="text-white/90">Quality assured products</P>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-white mt-1">✓</span>
                                        <P className="text-white/90">Fast delivery across India</P>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Branch Locations */}
                    <div>
                        <H2 className="text-3xl font-bold mb-8 text-center text-[#2d2d2d]">
                            Our Locations
                        </H2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Branch 1 - Head Office */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/60">
                                {/* Map Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-[#ff6b35] to-[#e55a25] relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-16 h-16 text-white/30" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                                        <P className="text-xs font-bold text-[#ff6b35]">HEAD OFFICE</P>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-[#ff6b35]" />
                                        <H3 className="text-xl font-bold text-[#2d2d2d]">Chennai Head Office</H3>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#6b6b6b] mt-1 flex-shrink-0" />
                                            <P className="text-[#6b6b6b]">
                                                148, Angappa Naicken Street, Near High Court, Chennai - 600001
                                            </P>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#6b6b6b]" />
                                            <div className="flex flex-col">
                                                <a href="tel:04442161198" className="text-[#6b6b6b] hover:text-[#ff6b35] transition-colors">
                                                    044 42161198
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <a 
                                        href="https://maps.app.goo.gl/feb24DqhazcAds2DA" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            className="w-full mt-6 bg-[#ff6b35] hover:bg-[#e55a25] text-white rounded-xl"
                                        >
                                            View on Map
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            {/* Branch 2 - Branch Office */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/60">
                                {/* Map Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-16 h-16 text-white/30" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                                        <P className="text-xs font-bold text-[#8b5cf6]">BRANCH OFFICE</P>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-[#8b5cf6]" />
                                        <H3 className="text-xl font-bold text-[#2d2d2d]">Chennai Branch</H3>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#6b6b6b] mt-1 flex-shrink-0" />
                                            <P className="text-[#6b6b6b]">
                                                142, Angappa Naicken Street, Near High Court, Chennai - 600001
                                            </P>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#6b6b6b]" />
                                            <a href="tel:04442176770" className="text-[#6b6b6b] hover:text-[#8b5cf6] transition-colors">
                                                044 42176770
                                            </a>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-6 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl"
                                    >
                                        View on Map
                                    </Button>
                                </div>
                            </div>

                            {/* Branch 3 - Factory */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/60">
                                {/* Map Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-[#a855f7] to-[#9333ea] relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-16 h-16 text-white/30" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                                        <P className="text-xs font-bold text-[#a855f7]">FACTORY</P>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-[#a855f7]" />
                                        <H3 className="text-xl font-bold text-[#2d2d2d]">Chennai Factory</H3>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#6b6b6b] mt-1 flex-shrink-0" />
                                            <P className="text-[#6b6b6b]">
                                                53/26, Amman Koil Street, Athipet, Kuppam, Ambattur Industrial Estate, Chennai - 600058
                                            </P>
                                        </div>
                                    </div>

                                    <a 
                                        href="https://maps.app.goo.gl/6rfTVetnL5qrTUnk8" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            className="w-full mt-6 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl"
                                        >
                                            View on Map
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Additional Branches */}
                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            {/* Bangalore Branch */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/60">
                                <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-14 h-14 text-white/30" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                                        <P className="text-xs font-bold text-blue-600">BANGALORE BRANCH</P>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                        <H3 className="text-xl font-bold text-[#2d2d2d]">Bangalore Office</H3>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#6b6b6b] mt-1 flex-shrink-0" />
                                            <P className="text-[#6b6b6b]">
                                                NO11, D.R Lane, S.J.P Road Cross, Bangalore - 560002
                                            </P>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#6b6b6b]" />
                                            <a href="tel:08043704703" className="text-[#6b6b6b] hover:text-blue-600 transition-colors">
                                                080 43704703
                                            </a>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                    >
                                        View on Map
                                    </Button>
                                </div>
                            </div>

                            {/* Ahmedabad Branch */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/60">
                                <div className="h-40 bg-gradient-to-br from-green-500 to-green-600 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="w-14 h-14 text-white/30" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
                                        <P className="text-xs font-bold text-green-600">AHMEDABAD BRANCH</P>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Building2 className="w-6 h-6 text-green-600" />
                                        <H3 className="text-xl font-bold text-[#2d2d2d]">Ahmedabad Office</H3>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#6b6b6b] mt-1 flex-shrink-0" />
                                            <P className="text-[#6b6b6b]">
                                                Shop No.20, Sumel-10, M.H Mill Compound, Near Ambedkar Hall, Saraspur, Ahmedabad - 380018
                                            </P>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                                    >
                                        View on Map
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section with Modern Gradient */}
                    <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-[#8b5cf6] via-[#7c3aed] to-[#a855f7] p-12 rounded-2xl shadow-2xl text-center text-white">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <H2 className="text-3xl font-bold mb-4 text-white">
                                Ready to Get Started?
                            </H2>
                            <P className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Contact us today for expert advice on hydraulic solutions tailored to your needs
                            </P>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a href="tel:+919884369751">
                                    <Button
                                        size="lg"
                                        className="bg-white text-[#8b5cf6] hover:bg-gray-100 font-bold px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        Call Now
                                    </Button>
                                </a>
                                <a href="mailto:info@amhat.com">
                                    <Button
                                        size="lg"
                                        className="bg-[#ff6b35] hover:bg-[#e55a25] text-white font-bold px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <Mail className="w-5 h-5 mr-2" />
                                        Email Us
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
