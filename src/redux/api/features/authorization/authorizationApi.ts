import { IAuthorization } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Authorization API endpoints using RTK Query
export const authorizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all authorizations
    getAllAuthorizations: builder.query<
      {
        success: boolean;
        message: string;
        data: IAuthorization[];
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
        url: "/authorizations",
        method: "GET",
      }),
      providesTags: ["authorizations"],
    }),

    // Get single authorization by ID
    getAuthorizationById: builder.query<
      {
        success: boolean;
        message: string;
        data: IAuthorization;
      },
      string
    >({
      query: (id) => ({
        url: `/authorizations/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "authorizations", id }],
    }),

    // Create authorization
    createAuthorization: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IAuthorization;
      },
      {
        authorizationData: Omit<
          IAuthorization,
          "_id" | "createdAt" | "updatedAt"
        >;
        imageFile?: File;
      }
    >({
      query: ({ authorizationData, imageFile }) => {
        if (imageFile) {
          // If file is provided, use FormData
          const formData = new FormData();
          formData.append("image", imageFile);

          return {
            url: "/authorizations/create",
            method: "POST",
            body: formData,
          };
        } else {
          // If no file, send JSON
          return {
            url: "/authorizations/create",
            method: "POST",
            body: { body: authorizationData },
          };
        }
      },
      invalidatesTags: ["authorizations"],
    }),

    // Update authorization
    updateAuthorization: builder.mutation<
      {
        success: boolean;
        message: string;
        data: IAuthorization;
      },
      {
        id: string;
        authorizationData: Partial<IAuthorization>;
        imageFile?: File;
      }
    >({
      query: ({ id, authorizationData, imageFile }) => {
        if (imageFile) {
          // If file is provided, use FormData
          const formData = new FormData();
          if (authorizationData.image)
            formData.append("image", authorizationData.image);

          // Append new image file
          formData.append("image", imageFile);

          return {
            url: `/authorizations/${id}`,
            method: "PATCH",
            body: formData,
          };
        } else {
          // If no file, send JSON
          return {
            url: `/authorizations/${id}`,
            method: "PATCH",
            body: { body: authorizationData },
          };
        }
      },
      invalidatesTags: (_, __, { id }) => [
        "authorizations",
        { type: "authorizations", id },
      ],
    }),

    // Delete authorization
    deleteAuthorization: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      string
    >({
      query: (id) => ({
        url: `/authorizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["authorizations"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllAuthorizationsQuery,
  useGetAuthorizationByIdQuery,
  useCreateAuthorizationMutation,
  useUpdateAuthorizationMutation,
  useDeleteAuthorizationMutation,
} = authorizationApi;
