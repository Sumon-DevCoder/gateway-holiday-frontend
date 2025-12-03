import { baseApi } from "@/redux/api/baseApi";
import {
  CompanyImagesResponse,
  CreateCompanyImagesRequest,
  ICompanyImages,
  UpdateCompanyImagesRequest,
} from "@/types/companyImages";

export const companyImagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all company images
    getCompanyImages: builder.query<ICompanyImages[], void>({
      query: () => ({
        url: "/company-images",
      }),
      providesTags: ["CompanyImages"],
    }),

    // Get company images by ID
    getCompanyImagesById: builder.query<ICompanyImages, string>({
      query: (id) => ({
        url: `/company-images/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "CompanyImages", id }],
    }),

    // Create company images
    createCompanyImages: builder.mutation<
      CompanyImagesResponse,
      CreateCompanyImagesRequest
    >({
      query: (data) => ({
        url: "/company-images",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CompanyImages"],
    }),

    // Update company images
    updateCompanyImages: builder.mutation<
      CompanyImagesResponse,
      { id: string; data: UpdateCompanyImagesRequest }
    >({
      query: ({ id, data }) => ({
        url: `/company-images/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "CompanyImages", id },
        "CompanyImages",
      ],
    }),

    // Delete company images
    deleteCompanyImages: builder.mutation<CompanyImagesResponse, string>({
      query: (id) => ({
        url: `/company-images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyImages"],
    }),
  }),
});

export const {
  useGetCompanyImagesQuery,
  useGetCompanyImagesByIdQuery,
  useCreateCompanyImagesMutation,
  useUpdateCompanyImagesMutation,
  useDeleteCompanyImagesMutation,
} = companyImagesApi;
