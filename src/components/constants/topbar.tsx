"use client"

import { Phone, ShoppingCart, User } from "lucide-react"
import { Container } from "../layout/container"
import { H4, P } from "../typography/typography"
import Image from "next/image"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

export default function Topbar() {
    return (
        <Container className="bg-[#272727] text-white text-sm border-b border-gray-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="bg-zinc-700 p-4 rounded-full">
                        <Phone className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                        <H4 className="font-semibold">Customer Support</H4>
                        <P>123-456-7890</P>
                    </div>
                </div>
                <div className="bg-white p-2 w-fit rounded-lg">
                    <Image alt="MSI" src={"/logo.png"} width={500} height={500} className="object-cover w-44 h-14" />
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-700 p-4 rounded-full">
                            <User className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <H4 className="font-semibold">My Account</H4>
                            <P className="">Register</P>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-700 p-4 rounded-full">
                            <ShoppingCart className="w-6 h-6 fill-white" />
                        </div>
                        <div>
                            <H4 className="font-semibold">My Cart</H4>
                            <P className="">Empty</P>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}
