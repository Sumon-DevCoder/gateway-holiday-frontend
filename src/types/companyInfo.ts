export interface ICompanyInfo {
  _id: string;
  companyName?: string;
  logo?: string;
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
  youtube_video?: string;
  yearsOfExperience: number;
  customer_review: string;
  destinations: string;
  openingHours: string; // e.g., "09:00 AM - 06:00 PM"
  close:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInfoResponse {
  success: boolean;
  message: string;
  data: ICompanyInfo | ICompanyInfo[];
}

export interface CreateCompanyInfoRequest extends FormData {}

export interface UpdateCompanyInfoRequest extends FormData {}

export interface CompanyInfoFormData {
  companyName: string;
  logo?: File | string;
  email: string[];
  phone: string[];
  address: string;
  googleMapUrl: string;
  description: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  youtube_video: string;
  yearsOfExperience: number;
  customer_review: string;
  destinations: string;
  openingHours: string;
  close:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
}
