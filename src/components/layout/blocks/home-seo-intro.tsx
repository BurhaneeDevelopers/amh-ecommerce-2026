import Link from "next/link";
import { MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "../container";
import { H1, P } from "@/components/typography/typography";

const productHighlights = [
  "Hydraulic hoses",
  "Hydraulic fittings",
  "Hydraulic tubes",
  "Hydraulic pumps",
  "Hydraulic valves",
  "Pneumatic components",
];

export default function HomeSeoIntro() {
  return (
    <section aria-labelledby="home-seo-heading" className="bg-white">
      <Container className="pt-2 sm:pt-4 lg:pt-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-orange-50/40 to-slate-50 p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              <MapPin className="h-3.5 w-3.5" />
              Chennai Hydraulic Supplier
            </div>

            <div className="space-y-3">
              <H1 id="home-seo-heading" className="text-slate-950">
                Hydraulic Components, Hoses &amp; Fittings Supplier in Chennai
              </H1>
              <P className="max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
                A.M. Hydraulics &amp; Tubes supplies hydraulic components for OEMs,
                factories, workshops, and industrial buyers across Chennai and Tamil Nadu.
                We stock hydraulic hoses, hose fittings, tubes, pumps, valves, and pneumatic
                components from trusted brands, and we also support custom hose assembly and
                crimping requirements.
              </P>
              <P className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                From our Parrys Corner showroom and Ambattur support location, we help buyers
                source genuine hydraulic products with quick response, technical guidance, and
                dependable supply for maintenance and production applications.
              </P>
            </div>

            <div className="flex flex-wrap gap-2">
              {productHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                  Local Industrial Supply
                </div>
                <p>Serving hydraulic buyers in Chennai, Parrys Corner, Ambattur, and across Tamil Nadu.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                  <Wrench className="h-4 w-4 text-orange-600" />
                  Product Range
                </div>
                <p>Hydraulic hoses, fittings, tubes, pumps, valves, and related pneumatic products.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  Buyer Support
                </div>
                <p>Quick quote support, product guidance, and custom hose assembly for industrial use.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Browse Hydraulic Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
