import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Public Gallery API endpoints for user interface
export const publicGalleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get active categories for public display
    getActiveCategories: builder.query<
      {
        success: boolean;
        message: string;
        data: ICategory[];
      },
      void
    >({
      query: () => ({
        url: "/gallery/categories/active",
      }),
      providesTags: ["galleryCategories"],
    }),

    // Get all subcategories for public display
    getAllSubCategories: builder.query<
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

    // Get subcategories by category for public display
    getSubCategoriesByCategory: builder.query<
      {
        success: boolean;
        message: string;
        data: ISubCategory[];
      },
      string
    >({
      query: (categoryId) => ({
        url: `/gallery/subcategories/category/${categoryId}`,
      }),
      providesTags: (_, __, categoryId) => [
        { type: "gallerySubCategories", id: categoryId },
      ],
    }),

    // Get all images for public display
    getPublicImages: builder.query<
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

    // Get images by subcategory for public display
    getImagesBySubCategory: builder.query<
      {
        success: boolean;
        message: string;
        data: IImage[];
      },
      string
    >({
      query: (subCategoryId) => ({
        url: `/gallery/images/subcategory/${subCategoryId}`,
      }),
      providesTags: (_, __, subCategoryId) => [
        { type: "galleryImages", id: subCategoryId },
      ],
    }),

    // Get single image for public display
    getSingleImage: builder.query<IImage, string>({
      query: (id) => ({
        url: `/gallery/images/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "galleryImages", id }],
    }),
  }),
});

export const {
  useGetActiveCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetPublicImagesQuery,
  useGetImagesBySubCategoryQuery,
  useGetSingleImageQuery,
} = publicGalleryApi;
