"use client";

import { H2, H3, P } from "@/components/typography/typography";
import { Award, FileCheck, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Certification {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    pdfUrl?: string;
    issueDate?: string;
    expiryDate?: string;
}

// Placeholder certifications - replace with actual data when certificates are uploaded
const certifications: Certification[] = [
    {
        id: "iso-9001",
        title: "ISO 9001:2015",
        description: "Quality Management System Certification",
        imageUrl: "/certifications/iso-9001.jpg", // Upload certificate image here
        pdfUrl: "/certifications/iso-9001.pdf", // Upload certificate PDF here
        issueDate: "2024",
    },
    {
        id: "iso-14001",
        title: "ISO 14001:2015",
        description: "Environmental Management System Certification",
        imageUrl: "/certifications/iso-14001.jpg", // Upload certificate image here
        pdfUrl: "/certifications/iso-14001.pdf", // Upload certificate PDF here
        issueDate: "2024",
    },
    // Add more certifications as needed
];

export function CertificationsSection() {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

    const handleViewCertificate = (cert: Certification) => {
        if (cert.pdfUrl) {
            // Open PDF in new tab
            window.open(cert.pdfUrl, "_blank");
        } else {
            // Show image in modal
            setSelectedCert(cert);
        }
    };

    return (
        <div className="py-16 bg-gradient-to-br from-[#fef5f0] to-white">
            <div className="max-w-6xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#8b5cf6] p-4 rounded-full">
                            <Award className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <H2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        Certifications & Quality Standards
                    </H2>
                    <P className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We are proud to be ISO certified, demonstrating our commitment to quality, 
                        safety, and continuous improvement in all aspects of our operations.
                    </P>
                </div>

                {/* ISO Certified Badge */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-t-4 border-[#ff6b35]">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <div className="bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] p-8 rounded-full">
                                <Shield className="w-20 h-20 text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <H3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                ISO Certified Company
                            </H3>
                            <P className="text-gray-700 leading-relaxed mb-4">
                                A.M. Hydraulics and Tubes maintains internationally recognized ISO certifications, 
                                ensuring that our products and services meet the highest standards of quality, 
                                environmental responsibility, and customer satisfaction.
                            </P>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="inline-flex items-center gap-2 bg-[#8b5cf6]/10 text-[#8b5cf6] px-4 py-2 rounded-full font-semibold">
                                    <FileCheck className="w-4 h-4" />
                                    Quality Assured
                                </span>
                                <span className="inline-flex items-center gap-2 bg-[#ff6b35]/10 text-[#ff6b35] px-4 py-2 rounded-full font-semibold">
                                    <Shield className="w-4 h-4" />
                                    Internationally Recognized
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certifications Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#8b5cf6] group"
                        >
                            {/* Certificate Image */}
                            <div className="relative h-64 bg-gradient-to-br from-[#8b5cf6]/5 to-[#ff6b35]/5 flex items-center justify-center overflow-hidden">
                                {cert.imageUrl ? (
                                    <Image
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            // Fallback if image doesn't exist
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="text-center p-8">
                                        <Award className="w-20 h-20 text-[#8b5cf6] mx-auto mb-4" />
                                        <P className="text-gray-500 text-sm">
                                            Certificate image will be displayed here
                                        </P>
                                    </div>
                                )}
                            </div>

                            {/* Certificate Details */}
                            <div className="p-6">
                                <H3 className="text-xl font-bold text-gray-900 mb-2">
                                    {cert.title}
                                </H3>
                                <P className="text-gray-600 mb-4 text-sm">
                                    {cert.description}
                                </P>
                                
                                {cert.issueDate && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <FileCheck className="w-4 h-4" />
                                        <span>Issued: {cert.issueDate}</span>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleViewCertificate(cert)}
                                    className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white py-3 rounded-lg font-semibold hover:from-[#7c3aed] hover:to-[#9333ea] transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                    <FileCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    View Certificate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder for when no certificates are uploaded yet */}
                {certifications.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <H3 className="text-xl font-semibold text-gray-700 mb-2">
                            Certifications Coming Soon
                        </H3>
                        <P className="text-gray-500">
                            Our ISO certifications and quality standards documentation will be displayed here.
                        </P>
                    </div>
                )}

                {/* Quality Commitment */}
                <div className="mt-12 bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] rounded-2xl p-8 text-white text-center">
                    <H3 className="text-2xl font-bold mb-4 text-white">
                        Our Commitment to Quality
                    </H3>
                    <P className="text-white/90 max-w-3xl mx-auto leading-relaxed">
                        These certifications reflect our dedication to maintaining the highest standards in 
                        manufacturing, quality control, and customer service. We continuously invest in training, 
                        technology, and processes to ensure that every product meets or exceeds industry standards.
                    </P>
                </div>
            </div>

            {/* Image Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedCert(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b flex items-center justify-between">
                            <H3 className="text-xl font-bold text-gray-900">
                                {selectedCert.title}
                            </H3>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="relative h-[70vh]">
                            {selectedCert.imageUrl && (
                                <Image
                                    src={selectedCert.imageUrl}
                                    alt={selectedCert.title}
                                    fill
                                    className="object-contain p-4"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
