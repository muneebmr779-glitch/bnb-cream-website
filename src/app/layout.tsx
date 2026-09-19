import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cakoo | Premium Bakery, Cakes & Desserts in Wah Cantt",
    template: "%s | Cakoo",
  },
  description:
    "Cakoo is a premium bakery in Wah Cantt crafting fresh cakes, pastries, cupcakes, and custom celebration cakes — baked with love, made for your moments.",
  keywords: [
    "Cakoo",
    "bakery",
    "cakes",
    "custom cakes",
    "Wah Cantt bakery",
    "pastries",
    "cupcakes",
    "desserts",
  ],
  openGraph: {
    title: "Cakoo | Premium Bakery, Cakes & Desserts",
    description:
      "Freshly baked cakes, pastries, and desserts crafted with passion. Order online or visit Cakoo in Wah Cantt.",
    url: siteUrl,
    siteName: "Cakoo",
    type: "website",
    locale: "en_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cakoo | Premium Bakery, Cakes & Desserts",
    description: "Baked with love. Made for moments.",
  },
  icons: {
    icon: "/icon",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Cakoo",
    image: `${siteUrl}/images/og-image.svg`,
    "@id": siteUrl,
    url: siteUrl,
    telephone: "+92-329-5115550",
    priceRange: "Rs 2,000–3,000",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lala Rukh, B-180 Minar Road",
      addressLocality: "Wah Cantt",
      postalCode: "47010",
      addressCountry: "PK",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:59",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-chocolate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#2E1A10",
              color: "#F5EAD8",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
