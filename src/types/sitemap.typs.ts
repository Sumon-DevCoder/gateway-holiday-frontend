// Types for API responses used in sitemap generation

export interface Tour {
  _id: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface Blog {
  _id: string;
  slug?: string;
  title: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface ToursResponse {
  success: boolean;
  data: Tour[];
  pagination?: {
    total: number;
  };
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  pagination?: {
    total: number;
  };
}
