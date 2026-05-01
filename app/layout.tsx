import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { metaContent } from "@/content/meta";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-heading",
  display: "swap"
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(metaContent.siteUrl),
  title: metaContent.title,
  description: metaContent.description,
  keywords: metaContent.keywords,
  openGraph: {
    title: metaContent.ogTitle,
    description: metaContent.ogDescription,
    type: "website",
    url: metaContent.siteUrl,
    images: [
      {
        url: metaContent.ogImage,
        width: 1200,
        height: 630,
        alt: metaContent.ogImageAlt,
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: metaContent.ogTitle,
    description: metaContent.ogDescription,
    images: [metaContent.ogImage]
  },
  alternates: {
    canonical: metaContent.siteUrl
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={metaContent.locale} suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
