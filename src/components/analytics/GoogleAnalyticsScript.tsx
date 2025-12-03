import Script from "next/script";

interface GoogleAnalyticsScriptProps {
  trackingId?: string;
}

/**
 * Google Analytics Script Component
 *
 * This component loads Google Analytics using manual script tags.
 * It's a simpler approach that works reliably.
 */
export default function GoogleAnalyticsScript({}: GoogleAnalyticsScriptProps) {
  // Use prop or environment variable
  const gaId = process.env["NEXT_PUBLIC_GA_ID"] || "";

  if (!gaId || !gaId.startsWith("G-")) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
