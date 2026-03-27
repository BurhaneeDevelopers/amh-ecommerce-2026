import { Container } from "@/components/layout/container";
import { H1, H2, H3, P } from "@/components/typography/typography";
import { Building2, Factory, MapPin, Phone, Mail, Award, Users, Target } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fef5f0]">
            {/* Hero Section */}
            <div className="bg-[#8b5cf6] text-white py-20">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                            About A.M. Hydraulics and Tubes
                        </H1>
                        <P className="text-xl text-white/90 leading-relaxed">
                            Leading manufacturer & distributor of hydraulic hoses and fittings in Chennai
                        </P>
                    </div>
                </Container>
            </div>

            {/* Company Overview */}
            <Container className="py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <H2 className="text-3xl font-bold mb-6 text-gray-900">
                                Who We Are
                            </H2>
                            <P className="text-gray-700 mb-4 leading-relaxed">
                                A.M. Hydraulics and Tubes is a premier manufacturer and distributor of hydraulic hoses and fittings, 
                                serving industries across Chennai and beyond. We are proud authorized stockists for leading global brands 
                                including Parker, Polyhose, Yuken, Rexroth (Bosch Group), Boss Hydraulics, Torque, Polyhydron, 
                                Hydroline Products, Micro Pre Temp, and H-T.
                            </P>
                            <P className="text-gray-700 leading-relaxed">
                                With our commitment to quality and customer satisfaction, we have established ourselves as a trusted 
                                partner for hydraulic solutions in various industrial applications.
                            </P>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/banners/tool-box.jpg"
                                alt="A.M. Hydraulics Facility"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#ff6b35] hover:shadow-xl transition-shadow">
                            <Award className="w-12 h-12 text-[#ff6b35] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-gray-900">Authorized Stockist</H3>
                            <P className="text-gray-600">
                                Official dealer for top international hydraulic brands ensuring genuine products and quality assurance.
                            </P>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#8b5cf6] hover:shadow-xl transition-shadow">
                            <Users className="w-12 h-12 text-[#8b5cf6] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-gray-900">Expert Team</H3>
                            <P className="text-gray-600">
                                Experienced professionals dedicated to providing technical support and customized hydraulic solutions.
                            </P>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#a855f7] hover:shadow-xl transition-shadow">
                            <Target className="w-12 h-12 text-[#a855f7] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-gray-900">Quality Focus</H3>
                            <P className="text-gray-600">
                                Committed to delivering high-quality hydraulic products that meet international standards.
                            </P>
                        </div>
                    </div>

                    {/* Leadership */}
                    <div className="bg-[#fef5f0] p-10 rounded-2xl shadow-lg mb-16">
                        <H2 className="text-3xl font-bold mb-8 text-center text-[#2d2d2d]">
                            Leadership
                        </H2>
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
                            <div className="flex items-start gap-6">
                                <div className="bg-[#ff6b35] p-4 rounded-full">
                                    <Users className="w-12 h-12 text-white" />
                                </div>
                                <div className="flex-1">
                                    <H3 className="text-2xl font-bold text-[#2d2d2d] mb-2">
                                        MOHAMMED HB
                                    </H3>
                                    <P className="text-[#ff6b35] font-semibold mb-4">
                                        Managing Director
                                    </P>
                                    <P className="text-[#4a4a4a] leading-relaxed">
                                        Under the visionary leadership of Mohammed HB, A.M. Hydraulics and Tubes has grown 
                                        to become a trusted name in the hydraulic industry, known for reliability, quality, 
                                        and exceptional customer service.
                                    </P>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-[#8b5cf6] text-white p-10 rounded-2xl shadow-2xl">
                        <H2 className="text-3xl font-bold mb-8 text-center text-white">
                            Get In Touch
                        </H2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Head Office */}
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building2 className="w-8 h-8" />
                                    <H3 className="text-xl font-bold text-white">Head Office</H3>
                                </div>
                                <div className="space-y-3 text-white/90">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                        <div>
                                            <P className="font-semibold text-white">Address:</P>
                                            <P>Shop: 148, Angappa Naicken Street</P>
                                            <P>Parrys Corner, Near High Court</P>
                                            <P>Chennai - 600001</P>
                                            <a 
                                                href="https://maps.app.goo.gl/feb24DqhazcAds2DA" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-yellow-300 hover:text-yellow-200 underline mt-1 inline-block"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5" />
                                        <div>
                                            <P className="font-semibold text-white">Office Phone:</P>
                                            <a href="tel:04442161198" className="hover:text-yellow-300">044 42161198</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5" />
                                        <div>
                                            <P className="font-semibold text-white">Personal Cell:</P>
                                            <a href="tel:+919884369751" className="hover:text-yellow-300">+91 98843 69751</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Factory */}
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Factory className="w-8 h-8" />
                                    <H3 className="text-xl font-bold text-white">Factory</H3>
                                </div>
                                <div className="space-y-3 text-white/90">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                        <div>
                                            <P className="font-semibold text-white">Address:</P>
                                            <P>53/26, Amman Koil Street, Athipet</P>
                                            <P>Kuppam, Ambattur Industrial Estate</P>
                                            <P>Chennai, Tamil Nadu 600058</P>
                                            <a 
                                                href="https://maps.app.goo.gl/6rfTVetnL5qrTUnk8" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-yellow-300 hover:text-yellow-200 underline mt-1 inline-block"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mt-8 pt-8 border-t border-white/20 text-center">
                            <div className="flex flex-wrap justify-center gap-8">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    <a href="mailto:info@amhat.com" className="hover:text-yellow-300 font-semibold">
                                        info@amhat.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    <span className="font-semibold">GST: 33AARFA1763B1ZS</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <a 
                                    href="https://www.am-hydraulics.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-yellow-300 hover:text-yellow-200 font-semibold underline"
                                >
                                    www.am-hydraulics.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Authorized Brands */}
                    <div className="mt-16">
                        <H2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                            Authorized Stockist & Dealers For
                        </H2>
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                {[
                                    'Parker', 'Polyhose', 'Yuken', 'Rexroth (Bosch Group)',
                                    'Boss Hydraulics', 'Torque', 'Polyhydron', 'Hydroline Products',
                                    'Micro Pre Temp', 'H-T'
                                ].map((brand, index) => (
                                    <div 
                                        key={index}
                                        className="p-4 rounded-lg bg-white border-2 border-[#e0d4f7] hover:border-[#ff6b35] transition-all hover:shadow-md"
                                    >
                                        <P className="font-semibold text-[#2d2d2d]">{brand}</P>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
