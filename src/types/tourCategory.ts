export interface ITourCategory {
  _id: string;
  category_name: string;
  img?: string;
  description?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourCategoryFormData {
  category_name: string;
  img?: File | string;
  description?: string;
}

export interface TourCategoryResponse {
  success: boolean;
  message: string;
  data: ITourCategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SingleTourCategoryResponse {
  success: boolean;
  message: string;
  data: ITourCategory;
}

export interface TourCategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ReorderTourCategoriesRequest {
  categoryIds: string[];
}

export interface ReorderTourCategoriesResponse {
  success: boolean;
  message: string;
  data: ITourCategory[];
}

