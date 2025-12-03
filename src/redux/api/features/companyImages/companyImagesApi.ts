import {
  CompanyImagesResponse,
  CreateCompanyImagesRequest,
  DeleteSpecificImageRequest,
  ICompanyImages,
  UpdateCompanyImagesRequest,
} from "@/types/companyImages";
import { baseApi } from "../../baseApi";

export const companyImagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all company images
    getCompanyImages: builder.query<CompanyImagesResponse, void>({
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
      transformResponse: (response: any) => response.data,
      providesTags: (_, __, id) => [{ type: "CompanyImages", id }],
    }),

    // Create company images
    createCompanyImages: builder.mutation<
      ICompanyImages,
      CreateCompanyImagesRequest
    >({
      query: (data) => ({
        url: "/company-images",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["CompanyImages"],
    }),

    // Update company images
    updateCompanyImages: builder.mutation<
      ICompanyImages,
      { id: string; data: UpdateCompanyImagesRequest }
    >({
      query: ({ id, data }) => ({
        url: `/company-images/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_, __, { id }) => [
        { type: "CompanyImages", id },
        "CompanyImages",
      ],
    }),

    // Delete company images
    deleteCompanyImages: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/company-images/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["CompanyImages"],
    }),

    // Delete specific image from any field
    deleteSpecificImage: builder.mutation<
      ICompanyImages,
      {
        id: string;
        fieldType: "affiliation" | "paymentAccept";
        data: DeleteSpecificImageRequest;
      }
    >({
      query: ({ id, fieldType, data }) => ({
        url: `/company-images/${id}/${fieldType}`,
        method: "DELETE",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_, __, { id }) => [
        { type: "CompanyImages", id },
        "CompanyImages",
      ],
    }),
  }),
});

export const {
  useGetCompanyImagesQuery,
  useGetCompanyImagesByIdQuery,
  useCreateCompanyImagesMutation,
  useUpdateCompanyImagesMutation,
  useDeleteCompanyImagesMutation,
  useDeleteSpecificImageMutation,
} = companyImagesApi;
