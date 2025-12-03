// MongoDB Schema Types for Travel Agency Management System

export interface ICompanyInfo {
  _id?: string;
  companyName: string;
  logo: string;
  affiliation: string[];
  paymentAccept: string[];
  email: string[];
  phone: string[];
  address: string;
  googleMapUrl?: string;
  description?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  officeHours?: {
    day: string;
    open: string;
    close: string;
  }[];
  customer_review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id?: string;
  userName: string;
  userProfileImg?: string;
  designation: string; // default: "Traveller"
  rating: number; // 1-5 scale
  comment: string;
  tourImages?: string[];
  createdAt: Date;
}

export interface IBlog {
  _id?: string;
  title: string;
  category: string;
  coverImage: string;
  content: string;
  tags: string[];
  readTime: string;
  status: "draft" | "published"; // default: "draft"
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam {
  _id: string;
  name: string; // max 100 characters
  designation: string; // max 100 characters
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadership {
  _id: string;
  name: string;
  designation: string;
  quote: string;
  image: string;
  imageAlt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IContact {
  _id?: string;
  name: string;
  email: string; // validated email format
  contactNo: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBanner {
  _id?: string;
  title: string;
  description: string;
  backgroundImage: string; // Single image URL
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthorization {
  _id?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICountryVisa {
  _id?: string;
  countryName: string;
  visaTypes: (string | { _id?: string; name: string; isActive?: boolean })[];
  processingFee?: number;
  processing_time?: string;
  required_document?: string; // rich text content
  isActive: boolean;
  order?: number; // manual ordering field for drag-and-drop
  createdAt: Date;
  updatedAt: Date;
}

// Gallery Module - Three interconnected schemas
export interface ICategory {
  _id?: string;
  name: string; // unique
  image: string; // category image (required)
  order?: number; // ordering field for drag-and-drop
}

export interface ISubCategory {
  _id?: string;
  categoryId: string; // references Category
  name: string;
  image: string; // subcategory image (required)
  order?: number; // ordering field for drag-and-drop
}

export interface IImage {
  _id?: string;
  categoryId?: string; // references Category
  subCategoryId?: string; // references SubCategory
  url: string;
  altText?: string;
  isActive?: boolean;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string; // unique, lowercase
  contact: string;
  profileImg?: string;
  password: string; // min 8 characters, not selected by default
  status: "active" | "block" | "deactive"; // default: "active"
  role: "user" | "moderator" | "admin"; // default: "user"
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuery {
  _id?: string;
  // Form identification
  formType: "hajj_umrah" | "package_tour";

  // Common fields
  name: string;
  email: string;
  contactNumber: string;
  startingDate: Date;
  returnDate: Date;
  airlineTicketCategory: "economy" | "business" | "first_class";
  specialRequirements?: string;

  // Hajj & Umrah specific
  nightsStayMakkah?: number;
  nightsStayMadinah?: number;
  maleAdults?: number;
  femaleAdults?: number;
  childs?: number;
  accommodationType?: "2_star" | "3_star" | "4_star" | "5_star";
  foodsIncluded?: boolean;
  guideRequired?: boolean;
  privateTransportation?: boolean;

  // Package Tour specific
  visitingCountry?: string;
  visitingCities?: string;

  // Admin tracking
  status: "pending" | "reviewed" | "contacted" | "closed"; // default: "pending"
  createdAt: Date;
  updatedAt: Date;
}

export interface IPolicyPage {
  _id?: string;
  slug: "terms" | "privacy" | "refund"; // unique
  content: string; // default: empty string
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Stats Interface
export interface IDashboardStats {
  totalUsers: number;
  totalQueries: number;
  totalReviews: number;
  totalBlogs: number;
  totalTeamMembers: number;
  totalContacts: number;
  totalVisas: number;
  totalGalleryImages: number;
  recentQueries: IQuery[];
  recentReviews: IReview[];
  queryStats: {
    pending: number;
    reviewed: number;
    contacted: number;
    closed: number;
  };
  userStats: {
    active: number;
    blocked: number;
    deactive: number;
  };
}
