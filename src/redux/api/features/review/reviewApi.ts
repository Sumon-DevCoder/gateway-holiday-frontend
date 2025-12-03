import { baseApi } from "../../baseApi";

export interface ReviewFormData {
  userName: string;
  userProfileImg?: File | string;
  designation: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userName: string;
    userProfileImg?: string;
    designation: string;
    rating: number;
    comment: string;
    tourImages?: string[];
    createdAt: string;
  };
}

export interface Review {
  _id: string;
  userName: string;
  userProfileImg?: string;
  designation: string;
  rating: number;
  comment: string;
  order?: number;
  tourImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all reviews with pagination
    getReviews: builder.query<
      ReviewsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);

        return {
          url: `/reviews/get-all?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["reviews"],
    }),

    // Get review by ID
    getReviewById: builder.query<{ success: boolean; data: Review }, string>({
      query: (id) => ({
        url: `/reviews/get-single/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "reviews", id }],
    }),

    // Create review
    createReview: builder.mutation<ReviewResponse, ReviewFormData>({
      query: (formData) => {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("userName", formData.userName);
        formDataToSend.append("designation", formData.designation);
        formDataToSend.append("rating", formData.rating.toString());
        formDataToSend.append("comment", formData.comment);

        if (formData.userProfileImg) {
          formDataToSend.append("userProfileImg", formData.userProfileImg);
        }

        return {
          url: "/reviews/create",
          method: "POST",
          body: formDataToSend,
        };
      },
      invalidatesTags: ["reviews"],
    }),

    // Update review
    updateReview: builder.mutation<
      ReviewResponse,
      { id: string; data: Partial<ReviewFormData> }
    >({
      query: ({ id, data }) => {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append("userName", data.userName || "");
        formDataToSend.append("designation", data.designation || "Traveller");
        formDataToSend.append("rating", (data.rating || 1).toString());
        formDataToSend.append("comment", data.comment || "");

        if (data.userProfileImg) {
          formDataToSend.append("userProfileImg", data.userProfileImg);
        }

        return {
          url: `/reviews/update/${id}`,
          method: "PUT",
          body: formDataToSend,
        };
      },
      invalidatesTags: (_, __, { id }) => [{ type: "reviews", id }, "reviews"],
    }),

    // Delete review
    deleteReview: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/reviews/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "reviews", id }, "reviews"],
    }),

    // Reorder reviews
    reorderReviews: builder.mutation<
      { success: boolean; message: string; data: Review[] },
      { reviewIds: string[] }
    >({
      query: ({ reviewIds }) => ({
        url: "/reviews/reorder",
        method: "PUT",
        body: { reviewIds },
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useReorderReviewsMutation,
} = reviewApi;
