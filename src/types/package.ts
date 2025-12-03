export interface ICountry {
  _id: string;
  name: string;
  isoCode: string;
  capital: string;
  continent: string;
  flagUrl: string;
}

export interface ITour {
  _id: string;
  code: string;
  title: string;
  destination: string;
  duration: {
    days: number;
    nights: number;
  };
  basePrice: number;
  bookingFeePercentage: number;
}

export interface IPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  coverImage: string;
  galleryImages: string[];
  countries: ICountry[];
  tours: ITour[];
  durationDays: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PackageFormData {
  name: string;
  description?: string;
  coverImage?: File;
  galleryImages?: File[];
  countries: string[];
  tours: string[];
  durationDays?: number;
}

export interface PackageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  tour?: string;
}

export interface PackageResponse {
  success: boolean;
  message: string;
  data: IPackage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
