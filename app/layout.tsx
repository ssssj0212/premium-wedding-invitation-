import type { Metadata } from "next";
import "./globals.css";
import { metaContent } from "@/content/meta";

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
        alt: metaContent.ogImageAlt
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
      <body>{children}</body>
    </html>
  );
}
