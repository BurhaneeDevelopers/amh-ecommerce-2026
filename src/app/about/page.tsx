import { Container } from "@/components/layout/container";
import { H1, H2, H3, P } from "@/components/typography/typography";
import { Building2, Factory, MapPin, Phone, Mail, Award, Users, Target } from "lucide-react";
import Image from "next/image";
import { CertificationsSection } from "@/components/layout/blocks/certifications-section";
import JsonLd from "@/components/seo/JsonLd";
import { ORGANIZATION_JSON_LD } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us — ISO Certified Since 1999 | A.M. Hydraulics & Tubes Chennai',
  description: 'A.M. Hydraulics & Tubes — ISO 9001:2015 & ISO 14001:2015 certified manufacturer and authorized distributor of hydraulic and pneumatic components since 1999. Founded by Managing Director Mohammed HB. Authorized stockist for Parker, Polyhose, Yuken, Rexroth (Bosch Group), Boss Hydraulics, Torque, Polyhydron, Enerpac, Festo, Vickers, Dowty. Shop: 148 Angappa Naicken Street, Parrys Corner, Chennai 600001. Factory: 53/26 Amman Koil Street, Ambattur Industrial Estate, Chennai 600058. Serving Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and across India.',
  alternates: {
    canonical: 'https://hydraulicstore.in/about',
  },
  openGraph: {
    title: 'About Us — ISO Certified Since 1999 | A.M. Hydraulics & Tubes Chennai',
    description: 'ISO 9001:2015 & ISO 14001:2015 certified hydraulic components manufacturer and distributor since 1999. Authorized Parker, Yuken, Rexroth dealer.',
    url: 'https://hydraulicstore.in/about',
  },
};

const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://hydraulicstore.in/about',
  url: 'https://hydraulicstore.in/about',
  name: 'About A.M. Hydraulics & Tubes',
  description: 'Learn about A.M. Hydraulics & Tubes - ISO certified hydraulic components supplier in Chennai since 1999',
  mainEntity: {
    '@id': 'https://hydraulicstore.in/#organization',
  },
};

export default function AboutPage() {
    return (
        <>
            <JsonLd data={[aboutPageSchema, ORGANIZATION_JSON_LD]} />
            <div className="min-h-screen bg-white">
            {/* Hero Section - Trust-First Design */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 md:py-32 overflow-hidden">
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
                
                <Container>
                    <div className="max-w-5xl mx-auto relative z-10">
                        {/* ISO Certifications Badge - Trust Signal First */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <Award className="w-5 h-5 text-amber-400" />
                                <span className="text-sm font-semibold text-white">ISO 9001:2015</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-semibold text-white">ISO 14001:2015</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <span className="text-sm font-semibold text-white">Established 1999</span>
                            </div>
                        </div>

                        <H1 className="text-4xl md:text-6xl font-bold mb-6 text-white text-center leading-tight">
                            A.M. Hydraulics & Tubes
                        </H1>
                        <P className="text-xl md:text-2xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto font-light">
                            ISO-certified manufacturer and authorized distributor of hydraulic and pneumatic components. 
                            Serving Chennai's industrial sector since 1999.
                        </P>
                    </div>
                </Container>
            </div>

            {/* Company Overview - Data-Forward */}
            <Container className="py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Stats Bar - Proof Through Numbers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-4xl font-bold text-slate-900 mb-2">25+</div>
                            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">Years Operating</div>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-4xl font-bold text-slate-900 mb-2">10+</div>
                            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">Authorized Brands</div>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-4xl font-bold text-slate-900 mb-2">2</div>
                            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">ISO Certifications</div>
                        </div>
                        <div className="text-center p-6 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="text-4xl font-bold text-slate-900 mb-2">2</div>
                            <div className="text-sm font-medium text-slate-600 uppercase tracking-wide">Locations</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
                        <div>
                            <div className="inline-block mb-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">About Us</span>
                            </div>
                            <H2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
                                Authorized Distributor for Global Hydraulic Brands
                            </H2>
                            <div className="space-y-4 text-slate-700 leading-relaxed">
                                <P className="text-lg">
                                    A.M. Hydraulics and Tubes is an ISO 9001:2015 and ISO 14001:2015 certified manufacturer 
                                    and authorized distributor of hydraulic hoses, fittings, pumps, valves, and pneumatic components.
                                </P>
                                <P className="text-lg">
                                    We serve as authorized stockists for Parker, Polyhose, Yuken, Rexroth (Bosch Group), 
                                    Boss Hydraulics, Torque, Polyhydron, Enerpac, Festo, Vickers, and Dowty—ensuring 
                                    genuine products backed by manufacturer warranties.
                                </P>
                                <P className="text-lg">
                                    Operating from both retail and manufacturing facilities in Chennai, we supply industrial 
                                    clients across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and pan-India.
                                </P>
                            </div>
                        </div>
                        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl border border-slate-200">
                            <Image
                                src="/banners/tool-box.jpg"
                                alt="A.M. Hydraulics Manufacturing Facility"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Core Capabilities - Clean Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-[#ff6b35] transition-colors">
                            <Award className="w-10 h-10 text-[#ff6b35] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-slate-900">ISO Certified Quality</H3>
                            <P className="text-slate-600 leading-relaxed">
                                ISO 9001:2015 quality management and ISO 14001:2015 environmental standards ensure 
                                consistent product quality and sustainable operations.
                            </P>
                        </div>
                        <div className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-[#ff6b35] transition-colors">
                            <Users className="w-10 h-10 text-[#ff6b35] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-slate-900">Technical Expertise</H3>
                            <P className="text-slate-600 leading-relaxed">
                                Experienced team providing technical support, custom hose assemblies, and hydraulic 
                                system design consultation for industrial applications.
                            </P>
                        </div>
                        <div className="bg-white p-8 rounded-lg border-2 border-slate-200 hover:border-[#ff6b35] transition-colors">
                            <Target className="w-10 h-10 text-[#ff6b35] mb-4" />
                            <H3 className="text-xl font-bold mb-3 text-slate-900">Authorized Stockist</H3>
                            <P className="text-slate-600 leading-relaxed">
                                Official dealer status for Parker, Yuken, Rexroth, and other global brands guarantees 
                                genuine products with manufacturer warranties.
                            </P>
                        </div>
                    </div>

                    {/* Leadership - Professional Presentation */}
                    <div className="bg-slate-50 border-2 border-slate-200 p-12 rounded-lg mb-20">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8 text-center">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leadership</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] p-6 rounded-lg flex-shrink-0">
                                    <Users className="w-16 h-16 text-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <H3 className="text-3xl font-bold text-slate-900 mb-2">
                                        Mohammed HB
                                    </H3>
                                    <P className="text-[#ff6b35] font-semibold text-lg mb-4">
                                        Managing Director
                                    </P>
                                    <P className="text-slate-700 leading-relaxed text-lg">
                                        Under Mohammed HB's leadership since 1999, A.M. Hydraulics and Tubes has established 
                                        itself as a trusted supplier in Chennai's industrial hydraulics sector, maintaining 
                                        authorized dealer relationships with global manufacturers and ISO certification standards.
                                    </P>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information - Structured & Scannable */}
                    <div className="bg-slate-900 text-white p-12 rounded-lg mb-20">
                        <div className="mb-10 text-center">
                            <H2 className="text-3xl font-bold text-white mb-2">
                                Locations & Contact
                            </H2>
                            <P className="text-slate-300">
                                Retail showroom in Parrys Corner, manufacturing facility in Ambattur Industrial Estate
                            </P>
                        </div>
                        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                            {/* Head Office */}
                            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                    <Building2 className="w-7 h-7 text-[#ff6b35]" />
                                    <H3 className="text-2xl font-bold text-white">Head Office & Showroom</H3>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-slate-400" />
                                        <div>
                                            <P className="font-semibold text-white mb-1">Address</P>
                                            <P className="text-slate-300 leading-relaxed">
                                                Shop: 148, Angappa Naicken Street<br />
                                                Parrys Corner, Near High Court<br />
                                                Chennai - 600001, Tamil Nadu
                                            </P>
                                            <a 
                                                href="https://maps.app.goo.gl/feb24DqhazcAds2DA" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[#ff6b35] hover:text-[#ff8c5a] font-medium mt-2 inline-block transition-colors"
                                            >
                                                View on Google Maps →
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="w-5 h-5 mt-1 text-slate-400" />
                                        <div>
                                            <P className="font-semibold text-white mb-1">Phone</P>
                                            <a href="tel:04442161198" className="text-slate-300 hover:text-white block transition-colors">
                                                044 42161198 (Office)
                                            </a>
                                            <a href="tel:+919884369751" className="text-slate-300 hover:text-white block transition-colors">
                                                +91 98843 69751 (Mobile)
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Factory */}
                            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                    <Factory className="w-7 h-7 text-[#ff6b35]" />
                                    <H3 className="text-2xl font-bold text-white">Manufacturing Facility</H3>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-slate-400" />
                                        <div>
                                            <P className="font-semibold text-white mb-1">Address</P>
                                            <P className="text-slate-300 leading-relaxed">
                                                53/26, Amman Koil Street, Athipet<br />
                                                Kuppam, Ambattur Industrial Estate<br />
                                                Chennai - 600058, Tamil Nadu
                                            </P>
                                            <a 
                                                href="https://maps.app.goo.gl/6rfTVetnL5qrTUnk8" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[#ff6b35] hover:text-[#ff8c5a] font-medium mt-2 inline-block transition-colors"
                                            >
                                                View on Google Maps →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mt-10 pt-10 border-t border-slate-700 text-center">
                            <div className="flex flex-wrap justify-center gap-8 text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-slate-400" />
                                    <a href="mailto:info@amhat.com" className="hover:text-white font-medium transition-colors">
                                        info@amhat.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-slate-400" />
                                    <span className="font-medium">GST: 33AARFA1763B1ZS</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <a 
                                    href="https://www.am-hydraulics.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold transition-colors"
                                >
                                    www.am-hydraulics.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Authorized Brands - Logo Grid */}
                    <div>
                        <div className="mb-10 text-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Partnerships</span>
                            <H2 className="text-3xl font-bold mt-2 text-slate-900">
                                Authorized Stockist & Dealer
                            </H2>
                        </div>
                        <div className="bg-white border-2 border-slate-200 p-10 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {[
                                    'Parker', 'Polyhose', 'Yuken', 'Rexroth', 'Boss Hydraulics',
                                    'Torque', 'Polyhydron', 'Enerpac', 'Festo', 'Vickers'
                                ].map((brand, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-center p-6 rounded-lg bg-slate-50 border-2 border-slate-200 hover:border-[#ff6b35] hover:bg-white transition-all"
                                    >
                                        <P className="font-bold text-slate-900 text-center text-sm">{brand}</P>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Certifications Section */}
            <CertificationsSection />
        </div>
        </>
    );
}
