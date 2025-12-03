/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    FB?: any;
  }
}

// Extend HTMLDivElement to include Facebook Page Plugin data attributes
declare module "react" {
  interface HTMLAttributes<T> {
    "data-href"?: string;
    "data-tabs"?: string;
    "data-width"?: string | number;
    "data-height"?: string | number;
    "data-small-header"?: string;
    "data-adapt-container-width"?: string;
    "data-hide-cover"?: string;
    "data-show-facepile"?: string;
  }
}

const FacebookPageEmbed = ({ facebookUrl }: { facebookUrl: string }) => {
  const [dimensions, setDimensions] = useState({ width: 350, height: 400 });

  useEffect(() => {
    // Listener for resizing
    function handleResize() {
      if (window.innerWidth < 768) {
        setDimensions({ width: 320, height: 380 }); // Mobile
      } else if (window.innerWidth < 1024) {
        setDimensions({ width: 500, height: 500 }); // Tablet
      } else {
        setDimensions({ width: 600, height: 600 }); // Desktop
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Load Facebook SDK
  useEffect(() => {
    if (window.FB) return; // Avoid loading multiple times
    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mb-4 h-[380px] w-[95%] overflow-hidden rounded-xl bg-white p-2 md:h-[500px] lg:h-[600px]">
      <div
        className="fb-page h-full w-full overflow-hidden rounded-2xl"
        data-href={facebookUrl || "https://www.facebook.com/gatewayholidaysbd"}
        data-tabs="timeline"
        data-width={dimensions.width}
        data-height={dimensions.height}
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      ></div>
    </div>
  );
};

export default FacebookPageEmbed;
