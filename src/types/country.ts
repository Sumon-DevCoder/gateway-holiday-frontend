export interface ICountry {
  _id?: string;
  name: string;
  imageUrl: string;
  isTop: boolean;
  order?: number;
  capital?: string;
  continent?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountryFormData {
  name: string;
  imageUrl: string;
  isTop: boolean;
}

export interface CountryResponse {
  success: boolean;
  message: string;
  data: ICountry;
}

export interface CountryListResponse {
  success: boolean;
  message: string;
  data: ICountry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    next?: number;
    prev?: number;
  };
}

export interface CreateCountryData {
  name: string;
  imageUrl?: string;
  isTop?: boolean;
}

export interface UpdateCountryData {
  name?: string;
  imageUrl?: string;
  isTop?: boolean;
  order?: number;
}

export interface ReorderCountriesRequest {
  countryIds: string[];
}

export interface ReorderCountriesResponse {
  success: boolean;
  message: string;
  data: ICountry[];
}
