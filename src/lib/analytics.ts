/**
 * Google Analytics Utility Functions
 *
 * এই file এ Google Analytics events track করার helper functions আছে।
 * Frontend components থেকে এই functions ব্যবহার করতে পারবেন।
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if Google Analytics is available
 */
function isGAAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag !== "undefined";
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
): void {
  if (!isGAAvailable()) {
    console.warn("Google Analytics not available");
    return;
  }

  window.gtag!("event", eventName, parameters);
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, pagePath?: string): void {
  trackEvent("button_click", {
    button_name: buttonName,
    page_path: pagePath || window.location.pathname,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  additionalData?: Record<string, any>
): void {
  trackEvent("form_submit", {
    form_name: formName,
    form_status: success ? "success" : "error",
    ...additionalData,
  });

  // Also track as lead if successful
  if (success) {
    trackEvent("generate_lead", {
      lead_type: formName,
      ...additionalData,
    });
  }
}

/**
 * Track package/tour view
 */
export function trackPackageView(
  packageId: string,
  packageName: string,
  packagePrice?: number,
  packageCategory?: string
): void {
  trackEvent("view_item", {
    item_id: packageId,
    item_name: packageName,
    item_category: packageCategory || "Travel Package",
    value: packagePrice,
    currency: "BDT",
  });
}

/**
 * Track booking initiation
 */
export function trackBookingStart(
  packageId: string,
  packageName: string,
  packagePrice: number,
  persons: number
): void {
  trackEvent("begin_checkout", {
    currency: "BDT",
    value: packagePrice * persons,
    items: [
      {
        item_id: packageId,
        item_name: packageName,
        price: packagePrice,
        quantity: persons,
      },
    ],
  });
}

/**
 * Track booking completion
 */
export function trackBooking(
  bookingType: string,
  bookingId: string,
  totalAmount: number,
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>
): void {
  trackEvent("purchase", {
    transaction_id: bookingId,
    value: totalAmount,
    currency: "BDT",
    booking_type: bookingType,
    items: items || [],
  });
}

/**
 * Track search
 */
export function trackSearch(
  searchTerm: string,
  searchType: "package" | "visa" | "hotel" | "transport",
  resultsCount?: number
): void {
  trackEvent("search", {
    search_term: searchTerm,
    search_type: searchType,
    results_count: resultsCount,
  });
}

/**
 * Track page view (custom)
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (!isGAAvailable()) {
    return;
  }

  window.gtag!("config", process.env["NEXT_PUBLIC_GA_ID"] || "", {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

/**
 * Track video play
 */
export function trackVideoPlay(
  videoTitle: string,
  videoDuration?: number,
  videoCategory?: string
): void {
  trackEvent("video_play", {
    video_title: videoTitle,
    video_duration: videoDuration,
    video_category: videoCategory,
  });
}

/**
 * Track file download
 */
export function trackDownload(
  fileName: string,
  fileType: string,
  fileSize?: number
): void {
  trackEvent("file_download", {
    file_name: fileName,
    file_type: fileType,
    file_size: fileSize,
  });
}

/**
 * Track share action
 */
export function trackShare(
  contentType: string,
  contentId: string,
  method: "facebook" | "twitter" | "whatsapp" | "email" | "copy_link"
): void {
  trackEvent("share", {
    content_type: contentType,
    content_id: contentId,
    method: method,
  });
}

/**
 * Track user engagement
 */
export function trackEngagement(
  engagementType: "scroll" | "click" | "hover" | "focus",
  elementName: string,
  additionalData?: Record<string, any>
): void {
  trackEvent("user_engagement", {
    engagement_type: engagementType,
    element_name: elementName,
    ...additionalData,
  });
}

/**
 * Track error
 */
export function trackError(
  errorMessage: string,
  errorType: string,
  pagePath?: string
): void {
  trackEvent("exception", {
    description: errorMessage,
    fatal: false,
    error_type: errorType,
    page_path: pagePath || window.location.pathname,
  });
}

/**
 * Set user properties
 */
export function setUserProperties(userId: string, userEmail?: string): void {
  if (!isGAAvailable()) {
    return;
  }

  window.gtag!("config", process.env["NEXT_PUBLIC_GA_ID"] || "", {
    user_id: userId,
    ...(userEmail && { user_email: userEmail }),
  });
}

/**
 * Analytics object with all functions
 */
export const analytics = {
  trackEvent,
  trackButtonClick,
  trackFormSubmit,
  trackPackageView,
  trackBookingStart,
  trackBooking,
  trackSearch,
  trackPageView,
  trackVideoPlay,
  trackDownload,
  trackShare,
  trackEngagement,
  trackError,
  setUserProperties,
};

export default analytics;
