import { IPackage, PackageQueryParams, PackageResponse } from "@/types/package";
import { baseApi } from "../../baseApi";

// API endpoints
export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all packages with pagination and filters
    getPackages: builder.query<PackageResponse, PackageQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params) {
          if (params.page) searchParams.append("page", params.page.toString());
          if (params.limit)
            searchParams.append("limit", params.limit.toString());
          if (params.search) searchParams.append("search", params.search);
          if (params.country) searchParams.append("country", params.country);
          if (params.tour) searchParams.append("tour", params.tour);
        }

        return {
          url: `/packages?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["packages"],
    }),

    // Get single package by ID
    getPackageById: builder.query<
      { success: boolean; message: string; data: IPackage },
      string
    >({
      query: (id) => ({ url: `/packages/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "packages", id }],
    }),

    // Create new package with images
    createPackage: builder.mutation<
      { success: boolean; message: string; data: IPackage },
      FormData
    >({
      query: (data) => ({
        url: "/packages/with-images",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),

    // Update package with images
    updatePackage: builder.mutation<
      { success: boolean; message: string; data: IPackage },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/packages/${id}/with-images`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "packages", id },
        "packages",
      ],
    }),

    // Delete package
    deletePackage: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
