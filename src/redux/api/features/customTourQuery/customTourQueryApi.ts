import { baseApi } from "../../baseApi";

export interface ICustomTourQuery {
  _id?: string;
  name: string;
  email?: string;
  phone: string;
  tourId?: string | { _id: string; title?: string; [key: string]: any };
  tourTitle?: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: boolean;
  status: "pending" | "contacted" | "closed";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomTourQueryRequest {
  name: string;
  email?: string;
  phone: string;
  tourId?: string;
  tourTitle?: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: boolean;
}

export interface CustomTourQueryResponse {
  success: boolean;
  message: string;
  data: ICustomTourQuery;
}

export interface CustomTourQueryListResponse {
  success: boolean;
  message: string;
  data: ICustomTourQuery[];
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

export interface CustomTourQueryStatsResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    pending: number;
    contacted: number;
    closed: number;
  };
}

export const customTourQueryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create custom tour query (Public)
    createCustomTourQuery: builder.mutation<
      CustomTourQueryResponse,
      CreateCustomTourQueryRequest
    >({
      query: (data) => ({
        url: "/custom-tour-queries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["customTourQueries"],
    }),

    // Get all custom tour queries (Admin only)
    getCustomTourQueries: builder.query<
      CustomTourQueryListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);

        return {
          url: `/custom-tour-queries?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["customTourQueries"],
    }),

    // Get custom tour query by ID (Admin only)
    getCustomTourQueryById: builder.query<CustomTourQueryResponse, string>({
      query: (id) => ({
        url: `/custom-tour-queries/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "customTourQueries", id }],
    }),

    // Update custom tour query (Admin only)
    updateCustomTourQuery: builder.mutation<
      CustomTourQueryResponse,
      {
        id: string;
        data: Partial<CreateCustomTourQueryRequest> & { status?: string };
      }
    >({
      query: ({ id, data }) => ({
        url: `/custom-tour-queries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "customTourQueries", id },
        "customTourQueries",
      ],
    }),

    // Delete custom tour query (Admin only)
    deleteCustomTourQuery: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/custom-tour-queries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customTourQueries"],
    }),

    // Get statistics (Admin only)
    getCustomTourQueryStats: builder.query<CustomTourQueryStatsResponse, void>({
      query: () => ({
        url: "/custom-tour-queries/stats",
        method: "GET",
      }),
      providesTags: ["customTourQueries"],
    }),

    // Get user's own custom tour queries (User only)
    getMyCustomTourQueries: builder.query<
      { success: boolean; message: string; data: ICustomTourQuery[] },
      void
    >({
      query: () => ({
        url: "/custom-tour-queries/my-queries",
        method: "GET",
      }),
      providesTags: ["customTourQueries"],
    }),
  }),
});

export const {
  useCreateCustomTourQueryMutation,
  useGetCustomTourQueriesQuery,
  useGetCustomTourQueryByIdQuery,
  useUpdateCustomTourQueryMutation,
  useDeleteCustomTourQueryMutation,
  useGetCustomTourQueryStatsQuery,
  useGetMyCustomTourQueriesQuery,
} = customTourQueryApi;
