import { baseApi } from "../../baseApi";

export interface NewsletterSubscribeData {
  email: string;
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export interface Newsletter {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewslettersResponse {
  success: boolean;
  message: string;
  data: Newsletter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NewsletterStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalSubscribers: number;
    todaySubscribers: number;
    weekSubscribers: number;
    monthSubscribers: number;
  };
}

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Subscribe to newsletter (Public)
    subscribeNewsletter: builder.mutation<
      NewsletterSubscribeResponse,
      NewsletterSubscribeData
    >({
      query: (data) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["newsletters", "newsletterStats"],
    }),

    // Get all newsletter subscribers (Admin only)
    getAllNewsletterSubscribers: builder.query<
      NewslettersResponse,
      {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.search) queryParams.append("search", params.search);

        return {
          url: `/newsletter/all?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["newsletters"],
    }),

    // Get subscriber by ID (Admin only)
    getNewsletterSubscriberById: builder.query<
      { success: boolean; data: Newsletter },
      string
    >({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "newsletters", id }],
    }),

    // Delete subscriber (Admin only)
    deleteNewsletterSubscriber: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["newsletters", "newsletterStats"],
    }),

    // Get newsletter statistics (Admin only)
    getNewsletterStats: builder.query<NewsletterStatsResponse, void>({
      query: () => ({
        url: "/newsletter/stats",
        method: "GET",
      }),
      providesTags: ["newsletterStats"],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetAllNewsletterSubscribersQuery,
  useGetNewsletterSubscriberByIdQuery,
  useDeleteNewsletterSubscriberMutation,
  useGetNewsletterStatsQuery,
} = newsletterApi;
