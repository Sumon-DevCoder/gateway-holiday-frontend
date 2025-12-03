import {
  CompanyInfoResponse,
  CreateCompanyInfoRequest,
  UpdateCompanyInfoRequest,
} from "@/types/companyInfo";
import { baseApi } from "../../baseApi";

export const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all company information (Public)
    getAllCompanyInfo: builder.query<CompanyInfoResponse, void>({
      query: () => ({
        url: "/company-info",
        method: "GET",
      }),
      providesTags: ["companyInfo"],
    }),

    // Get company information by ID (Public)
    getCompanyInfoById: builder.query<CompanyInfoResponse, string>({
      query: (id) => ({
        url: `/company-info/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "companyInfo", id }],
    }),

    // Create company information (Admin only)
    createCompanyInfo: builder.mutation<
      CompanyInfoResponse,
      CreateCompanyInfoRequest
    >({
      query: (data) => ({
        url: "/company-info",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["companyInfo"],
    }),

    // Update company information (Admin only)
    updateCompanyInfo: builder.mutation<
      CompanyInfoResponse,
      { id: string; data: UpdateCompanyInfoRequest }
    >({
      query: ({ id, data }) => ({
        url: `/company-info/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "companyInfo", id },
        "companyInfo",
      ],
    }),

    // Delete company information (Admin only)
    deleteCompanyInfo: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/company-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["companyInfo"],
    }),
  }),
});

export const {
  useGetAllCompanyInfoQuery,
  useGetCompanyInfoByIdQuery,
  useCreateCompanyInfoMutation,
  useUpdateCompanyInfoMutation,
  useDeleteCompanyInfoMutation,
} = companyInfoApi;
