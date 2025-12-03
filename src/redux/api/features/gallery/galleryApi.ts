import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Category API endpoints
export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Category endpoints
    getCategories: builder.query<
      {
        data: ICategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      any
    >({
      query: (params) => ({
        url: "/gallery/categories",
        params,
      }),
      providesTags: ["galleryCategories"],
    }),

    getActiveCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/gallery/categories/active",
      }),
      providesTags: ["galleryCategories"],
    }),

    getSingleCategory: builder.query<ICategory, string>({
      query: (id) => ({
        url: `/gallery/categories/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryCategories", id }],
    }),

    createCategory: builder.mutation<ICategory, FormData>({
      query: (data) => ({
        url: "/gallery/categories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["galleryCategories"],
    }),

    updateCategory: builder.mutation<ICategory, { id: string; data: FormData }>(
      {
        query: ({ id, data }) => ({
          url: `/gallery/categories/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "galleryCategories", id },
          "galleryCategories",
        ],
      }
    ),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["galleryCategories"],
    }),

    reorderCategories: builder.mutation<
      { success: boolean; message: string; data: ICategory[] },
      { categoryIds: string[] }
    >({
      query: (data) => ({
        url: "/gallery/categories/reorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["galleryCategories"],
    }),

    // SubCategory endpoints
    getSubCategories: builder.query<
      {
        data: ISubCategory[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      any
    >({
      query: (params) => ({
        url: "/gallery/subcategories",
        params,
      }),
      providesTags: ["gallerySubCategories"],
    }),

    getSubCategoriesByCategory: builder.query<ISubCategory[], string>({
      query: (categoryId) => ({
        url: `/gallery/subcategories/category/${categoryId}`,
      }),
      providesTags: (_, __, categoryId) => [
        { type: "gallerySubCategories", id: categoryId },
      ],
    }),

    getSingleSubCategory: builder.query<ISubCategory, string>({
      query: (id) => ({
        url: `/gallery/subcategories/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "gallerySubCategories", id }],
    }),

    createSubCategory: builder.mutation<ISubCategory, FormData>({
      query: (data) => ({
        url: "/gallery/subcategories/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gallerySubCategories"],
    }),

    updateSubCategory: builder.mutation<
      ISubCategory,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/subcategories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "gallerySubCategories", id },
        "gallerySubCategories",
      ],
    }),

    deleteSubCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/subcategories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallerySubCategories"],
    }),

    reorderSubCategories: builder.mutation<
      { success: boolean; message: string; data: ISubCategory[] },
      { subCategoryIds: string[] }
    >({
      query: (data) => ({
        url: "/gallery/subcategories/reorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gallerySubCategories"],
    }),

    // Image endpoints
    getImages: builder.query<
      {
        data: IImage[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      any
    >({
      query: (params) => ({
        url: "/gallery/images",
        params,
      }),
      providesTags: ["galleryImages"],
    }),

    getImagesBySubCategory: builder.query<IImage[], string>({
      query: (subCategoryId) => ({
        url: `/gallery/images/subcategory/${subCategoryId}`,
      }),
      providesTags: (_, __, subCategoryId) => [
        { type: "galleryImages", id: subCategoryId },
      ],
    }),

    getSingleImage: builder.query<IImage, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryImages", id }],
    }),

    createImage: builder.mutation<
      IImage,
      {
        image: File;
        categoryId?: string;
        subCategoryId?: string;
        altText?: string;
      }
    >({
      query: ({ image, categoryId, subCategoryId, altText }) => {
        const formData = new FormData();
        formData.append("image", image);
        if (categoryId) {
          formData.append("categoryId", categoryId);
        }
        if (subCategoryId) {
          formData.append("subCategoryId", subCategoryId);
        }
        if (altText) {
          formData.append("altText", altText);
        }

        return {
          url: "/gallery/images/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["galleryImages"],
    }),

    updateImage: builder.mutation<
      IImage,
      {
        id: string;
        data: {
          categoryId?: string;
          subCategoryId?: string;
          altText?: string;
          isActive?: boolean;
        };
      }
    >({
      query: ({ id, data }) => ({
        url: `/gallery/images/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "galleryImages", id },
        "galleryImages",
      ],
    }),

    deleteImage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["galleryImages"],
    }),
  }),
});

export const {
  // Category hooks
  useGetCategoriesQuery,
  useGetActiveCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,

  // SubCategory hooks
  useGetSubCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetSingleSubCategoryQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useReorderSubCategoriesMutation,

  // Image hooks
  useGetImagesQuery,
  useGetImagesBySubCategoryQuery,
  useGetSingleImageQuery,
  useCreateImageMutation,
  useUpdateImageMutation,
  useDeleteImageMutation,
} = galleryApi;
