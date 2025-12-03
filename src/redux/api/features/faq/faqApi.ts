import {
  CreateFaqRequest,
  FaqFilters,
  FaqStats,
  FaqsResponse,
  IFaq,
  UpdateFaqRequest,
} from "@/types/faq";
import { baseApi } from "../../baseApi";

// FAQ API endpoints
export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all FAQs with pagination and filters (Admin only)
    getFaqs: builder.query<FaqsResponse, FaqFilters>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        if (typeof params.isActive === "boolean")
          searchParams.append("isActive", params.isActive.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);

        return {
          url: `/faqs/all?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["faqs"],
    }),

    // Get FAQ by ID (Admin only)
    getSingleFaq: builder.query<IFaq, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "faqs", id }],
    }),

    // Get FAQ statistics (Admin only)
    getFaqStats: builder.query<FaqStats, void>({
      query: () => ({
        url: "/faqs/stats",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["faqStats"],
    }),

    // Get active FAQs for public display (Public)
    getActiveFaqs: builder.query<IFaq[], void>({
      query: () => ({
        url: "/faqs",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["activeFaqs"],
    }),

    // Create new FAQ (Admin only)
    createFaq: builder.mutation<
      { success: boolean; message: string; data: IFaq },
      CreateFaqRequest
    >({
      query: (data) => ({
        url: "/faqs/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faqs", "faqStats", "activeFaqs"],
    }),

    // Update FAQ (Admin only)
    updateFaq: builder.mutation<
      { success: boolean; message: string; data: IFaq },
      { id: string; data: UpdateFaqRequest }
    >({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "faqs", id },
        "faqs",
        "faqStats",
        "activeFaqs",
      ],
    }),

    // Delete FAQ (Admin only)
    deleteFaq: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faqs", "faqStats", "activeFaqs"],
    }),

    // Toggle FAQ status (Admin only)
    toggleFaqStatus: builder.mutation<
      { success: boolean; message: string; data: IFaq },
      string
    >({
      query: (id) => ({
        url: `/faqs/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "faqs", id },
        "faqs",
        "faqStats",
        "activeFaqs",
      ],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetSingleFaqQuery,
  useGetFaqStatsQuery,
  useGetActiveFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useToggleFaqStatusMutation,
} = faqApi;
