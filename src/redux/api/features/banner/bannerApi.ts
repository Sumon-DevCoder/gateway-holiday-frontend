import { IBanner } from "@/types/schemas";
import { baseApi } from "../../baseApi";

type BannerRequestPayload = {
  title: string;
  description: string;
  backgroundImage?: string;
};

// Banner API endpoints using RTK Query
export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all banners
    getAllBanners: builder.query<
      {
        success: boolean;
        message: string;
        data: IBanner[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      },
      void
    >({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    // Get active banners
    getActiveBanners: builder.query<
      {
        success: boolean;
        message: string;
        data: IBanner[];
      },
      void
    >({
      query: () => ({
        url: "/banners/active",
        method: "GET",
      }),
      providesTags: ["banners"],
    }),

    // Get single banner by ID
    getBannerById: builder.query<
      {
        success: boolean;
        message: string;
        data: IBanner;
      },
      string
    >({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "banners", id }],
    }),

    // Create banner
    createBanner: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IBanner;
      },
      {
        bannerData: BannerRequestPayload;
        imageFile?: File;
      }
    >({
      query: ({ bannerData, imageFile }) => {
        if (imageFile) {
          // If file is provided, use FormData
          const formData = new FormData();
          formData.append("title", bannerData.title);
          formData.append("description", bannerData.description);
          formData.append("backgroundImages", imageFile);

          return {
            url: "/banners/create",
            method: "POST",
            body: formData,
          };
        } else {
          // If no file, send JSON
          return {
            url: "/banners/create",
            method: "POST",
            body: { body: bannerData },
          };
        }
      },
      invalidatesTags: ["banners"],
    }),

    // Update banner
    updateBanner: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IBanner;
      },
      {
        id: string;
        bannerData: Partial<BannerRequestPayload>;
        imageFile?: File;
      }
    >({
      query: ({ id, bannerData, imageFile }) => {
        if (imageFile) {
          // If file is provided, use FormData
          const formData = new FormData();
          if (bannerData.title) formData.append("title", bannerData.title);
          if (bannerData.description)
            formData.append("description", bannerData.description);

          // Append new image file
          formData.append("backgroundImages", imageFile);

          return {
            url: `/banners/${id}`,
            method: "PATCH",
            body: formData,
          };
        } else {
          // If no file, send JSON
          return {
            url: `/banners/${id}`,
            method: "PATCH",
            body: { body: bannerData },
          };
        }
      },
      invalidatesTags: (_, __, { id }) => ["banners", { type: "banners", id }],
    }),

    // Delete banner
    deleteBanner: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),

    // Toggle banner status
    toggleBannerStatus: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IBanner;
      },
      {
        id: string;
        isActive: boolean;
      }
    >({
      query: ({ id, isActive }) => ({
        url: `/banners/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_, __, { id }) => ["banners", { type: "banners", id }],
    }),

    // Upload banner images only
    uploadBannerImages: builder.mutation<
      {
        success: boolean;
        message: string;
        data: { backgroundImage: string[] };
      },
      File[]
    >({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("backgroundImages", file);
        });

        return {
          url: "/banners/upload-images",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllBannersQuery,
  useGetActiveBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
  useUploadBannerImagesMutation,
} = bannerApi;
