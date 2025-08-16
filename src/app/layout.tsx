import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/constants/navbar";
import Topbar from "@/components/constants/topbar";
import Footer from "@/components/constants/footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "MSI E-Commerce",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <Topbar />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
