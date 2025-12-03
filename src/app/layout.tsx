import FacebookPixelScript from "@/components/analytics/FacebookPixelScript";
import GoogleAnalyticsScript from "@/components/analytics/GoogleAnalyticsScript";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gateway Holidays - Explore the World with Wonders",
  description:
    "Your gateway to unforgettable adventures and magical destinations. Expert travel planning, 24/7 support, and best price guarantee.",
  icons: {
    icon: "/logo.ico",
  },
  // Google Search Console Verification 
  other: {
    "google-site-verification":
      process.env["NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_CODE"] || "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Analytics and facebook pixel */}
        <GoogleAnalyticsScript />
        <FacebookPixelScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
