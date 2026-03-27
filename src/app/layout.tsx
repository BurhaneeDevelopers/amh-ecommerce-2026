import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import ProtectedComponent from "@/components/layout/ProtectedComponent";
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900']
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "A.M. Hydraulics - Hydraulic Hoses & Fittings",
  description: "Leading manufacturer & distributor of hydraulic hoses and fittings in Chennai. Authorized stockist for Parker, Polyhose, Yuken, Rexroth, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <NextTopLoader
          color="#ff6b35"
          height={4}
          showSpinner={false}
          speed={200}
          shadow="0 0 10px #ff6b35,0 0 5px #ff6b35"
        />
        <ProtectedComponent>
          {children}
        </ProtectedComponent>
      </body>
    </html>
  );
}
