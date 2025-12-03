export interface CompanyData {
  // Backend schema required fields
  companyName?: string;
  logo?: string;
  email: string[];
  phone: string[];
  address: string;

  // Backend schema optional fields
  googleMapUrl?: string;
  description?: string;
  socialLinks: SocialLinks;
  yearsOfExperience?: number;
  customer_review?: string;
  destinations?: string;

  // Backend schema opening hours
  openingHours?: string;
  close?:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  // Legacy officeHours for backward compatibility
  officeHours?: OfficeHour[];

  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

export interface OfficeHour {
  day: string;
  open: string;
  close: string;
}

export interface TopNavbarProps {
  isLoggedIn?: boolean;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  companyData?: any; // Using any to match ICompanyInfo from API
}

export interface NavbarProps {
  isLoggedIn?: boolean;
  userType?: "user" | "moderator" | "admin" | "super_admin";
}

export interface SocialIcon {
  key: string;
  label: string;
  href?: string | undefined;
  color?: string;
}
