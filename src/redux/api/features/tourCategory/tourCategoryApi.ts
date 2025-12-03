import {
  ITourCategory,
  ReorderTourCategoriesRequest,
  ReorderTourCategoriesResponse,
  SingleTourCategoryResponse,
  TourCategoryQueryParams,
  TourCategoryResponse,
} from "@/types/tourCategory";
import { baseApi } from "../../baseApi";

export const tourCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tour categories with pagination
    getTourCategories: builder.query<
      TourCategoryResponse,
      TourCategoryQueryParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params) {
          if (params.page) searchParams.append("page", params.page.toString());
          if (params.limit)
            searchParams.append("limit", params.limit.toString());
          if (params.search) searchParams.append("search", params.search);
        }

        return {
          url: `/tour-categories?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["tourCategories"],
    }),

    // Get all active tour categories (for dropdown)
    getActiveTourCategories: builder.query<
      { success: boolean; message: string; data: ITourCategory[] },
      void
    >({
      query: () => ({ url: "/tour-categories/active" }),
      providesTags: ["tourCategories"],
    }),

    // Get single tour category by ID
    getTourCategoryById: builder.query<SingleTourCategoryResponse, string>({
      query: (id) => ({ url: `/tour-categories/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "tourCategories", id }],
    }),

    // Create new tour category without image
    createTourCategory: builder.mutation<
      SingleTourCategoryResponse,
      { category_name: string; description?: string }
    >({
      query: (data) => ({
        url: "/tour-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tourCategories"],
    }),

    // Create new tour category with image
    createTourCategoryWithImage: builder.mutation<
      SingleTourCategoryResponse,
      FormData
    >({
      query: (data) => ({
        url: "/tour-categories/with-image",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tourCategories"],
    }),

    // Update tour category without image
    updateTourCategory: builder.mutation<
      SingleTourCategoryResponse,
      { id: string; data: { category_name?: string; description?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/tour-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "tourCategories", id },
        "tourCategories",
      ],
    }),

    // Update tour category with image
    updateTourCategoryWithImage: builder.mutation<
      SingleTourCategoryResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/tour-categories/${id}/with-image`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "tourCategories", id },
        "tourCategories",
      ],
    }),

    // Delete tour category
    deleteTourCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/tour-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tourCategories"],
    }),

    // Reorder tour categories (Admin only)
    reorderTourCategories: builder.mutation<
      ReorderTourCategoriesResponse,
      ReorderTourCategoriesRequest
    >({
      query: (data) => ({
        url: "/tour-categories/reorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tourCategories"],
    }),
  }),
});

export const {
  useGetTourCategoriesQuery,
  useGetActiveTourCategoriesQuery,
  useGetTourCategoryByIdQuery,
  useCreateTourCategoryMutation,
  useCreateTourCategoryWithImageMutation,
  useUpdateTourCategoryMutation,
  useUpdateTourCategoryWithImageMutation,
  useDeleteTourCategoryMutation,
  useReorderTourCategoriesMutation,
} = tourCategoryApi;
