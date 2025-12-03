export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqRequest {
  question: string;
  answer?: string;
  isActive?: boolean;
}

export interface UpdateFaqRequest {
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export interface FaqFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FaqStats {
  total: number;
  active: number;
  inactive: number;
}

export interface FaqsResponse {
  data: IFaq[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
