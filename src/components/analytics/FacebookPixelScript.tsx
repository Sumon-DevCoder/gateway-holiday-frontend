import Script from "next/script";

/**
 * Facebook Pixel Script Component
 *
 * This component loads Facebook Pixel using Next.js Script component.
 * It initializes the pixel and provides a global fbq function for tracking events.
 *
 * Usage:
 * - Pass pixelId as prop: <FacebookPixelScript pixelId="1234567890" />
 * - Or set NEXT_PUBLIC_FB_PIXEL_ID in .env.local file
 */
export default function FacebookPixelScript() {
  // Use prop or environment variable
  const fbPixelId = process.env["NEXT_PUBLIC_FB_PIXEL_ID"] || "";

  if (!fbPixelId) {
    // Don't render anything if no pixel ID is provided
    return null;
  }

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${fbPixelId}');
          fbq('track', 'PageView');
          
         
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
