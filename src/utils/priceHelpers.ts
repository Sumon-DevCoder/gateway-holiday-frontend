/**
 * Calculate the final price of a tour based on offer settings
 */
export function calculateFinalPrice(tour: {
  basePrice: number;
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
  };
}): number {
  if (!tour.offer?.isActive) {
    return tour.basePrice;
  }

  if (tour.offer.discountType === "flat" && tour.offer.flatDiscount) {
    return Math.max(0, tour.basePrice - tour.offer.flatDiscount);
  }

  if (
    tour.offer.discountType === "percentage" &&
    tour.offer.discountPercentage
  ) {
    const discount = (tour.basePrice * tour.offer.discountPercentage) / 100;
    return Math.max(0, tour.basePrice - discount);
  }

  return tour.basePrice;
}

/**
 * Get the discount amount in BDT
 */
export function getDiscountAmount(tour: {
  basePrice: number;
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
  };
}): number {
  if (!tour.offer?.isActive) {
    return 0;
  }

  if (tour.offer.discountType === "flat" && tour.offer.flatDiscount) {
    return tour.offer.flatDiscount;
  }

  if (
    tour.offer.discountType === "percentage" &&
    tour.offer.discountPercentage
  ) {
    return (tour.basePrice * tour.offer.discountPercentage) / 100;
  }

  return 0;
}

/**
 * Format price with BDT currency
 */
export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}
