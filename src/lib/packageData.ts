// Meal data structure matching backend schema
export interface MealData {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

// Itinerary block structure matching backend schema
export interface ItineraryBlock {
  type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
  title?: string;
  subtitle?: string;
  description?: string;
  meals?: MealData;
  hotelName?: string;
  timeFrom?: string;
  timeTo?: string;
}

// Itinerary day structure matching backend schema
export interface ItineraryDay {
  dayNo: number; // 1, 2, 3...
  title: string; // "Pick up from Airport & Transfer to Hotel"
  blocks: ItineraryBlock[];
}

// Offer structure matching backend schema
export interface Offer {
  isActive: boolean;
  discountType: "flat" | "percentage";
  flatDiscount?: number; // Amount in BDT (e.g., 5000)
  discountPercentage?: number; // Percentage value (e.g., 20)
  label?: string; // "Eid Special", "Winter Offer"
}

// TravelPackage interface matching backend ITour schema
export interface TravelPackage {
  _id: string; // MongoDB ObjectId as string
  code: string; // "CAMB001" unique
  title: string; // "Siem Reap (3D/2N)"
  destination: string | { _id: string; name: string }; // ObjectId reference or populated object
  duration: {
    days: number;
    nights: number;
  };
  category: string | { _id: string; category_name: string }; // ObjectId reference or populated object
  tags: string[];

  highlights: string[]; // bullets (left list)
  inclusion: string[];
  exclusion: string[];
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;

  coverImageUrl?: string; // Cloudinary secure_url
  coverImageId?: string; // Cloudinary public_id (optional)
  galleryUrls: string[]; // array of secure_url
  galleryIds: string[]; // array of public_id (optional)

  basePrice: number;
  bookingFeePercentage: number; // Booking advance percentage (e.g., 20 means 20% of basePrice)

  // Offer fields (optional) - discounted price will be calculated from basePrice
  offer?: Offer;

  itinerary: ItineraryDay[];

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date | string;
  order?: number; // manual ordering field for drag-and-drop

  // Legacy/computed fields for backward compatibility
  id?: string; // Alias for _id
  price?: number; // Computed: basePrice - (offer discount if active)
  originalPrice?: number; // Alias for basePrice
  image?: string; // Alias for coverImageUrl
  galleryImages?: string[]; // Alias for galleryUrls
  categoryName?: string; // Populated category name
  inclusions?: string[]; // Alias for inclusion
  exclusions?: string[]; // Alias for exclusion
  packageCode?: string; // Alias for code
  country?: string; // Populated destination name
  rating?: number; // Computed from reviews
  reviewCount?: number; // Count from reviews
  isRecommended?: boolean; // Computed field
  bookingFee?: number; // Computed: (basePrice * bookingFeePercentage) / 100
}

// Legacy DayItinerary interface for backward compatibility
// @deprecated Use ItineraryDay instead
export interface DayItinerary {
  day: number;
  location: string;
  title?: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  transportation: string;
  timeFrom?: string;
  timeTo?: string;
  description?: string;
}

export const packageCategories = [
  { value: "all", label: "All Packages" },
  { value: "regular", label: "Regular" },
  { value: "combo", label: "Combo" },
  { value: "latest", label: "Latest" },
  { value: "recommended", label: "Recommended" },
];

export const destinations = [
  "Japan",
  "Thailand",
  "Maldives",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Vietnam",
  "Philippines",
  "South Korea",
  "Taiwan",
];

export const durationRanges = [
  { min: 1, max: 3, label: "1-3 days" },
  { min: 4, max: 7, label: "4-7 days" },
  { min: 8, max: 14, label: "8-14 days" },
  { min: 15, max: 30, label: "15+ days" },
];

export const priceRanges = [
  { min: 0, max: 50000, label: "Under ৳50,000" },
  { min: 50000, max: 100000, label: "৳50,000 - ৳100,000" },
  { min: 100000, max: 150000, label: "৳100,000 - ৳150,000" },
  { min: 150000, max: 200000, label: "৳150,000 - ৳200,000" },
  { min: 200000, max: 300000, label: "৳200,000+" },
];
