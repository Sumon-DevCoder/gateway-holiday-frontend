import {
  CreatePolicyPageRequest,
  PolicyPageResponse,
  PolicyPagesListResponse,
  UpdatePolicyPageRequest,
} from "../../../../types/policy";
import { baseApi } from "../../baseApi";

export const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create policy page (Admin only)
    createPolicyPage: builder.mutation<
      PolicyPageResponse,
      CreatePolicyPageRequest
    >({
      query: (data) => ({
        url: "/policy-pages/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["policyPages"],
    }),

    // Get all policy pages (Public)
    getAllPolicyPages: builder.query<PolicyPagesListResponse, void>({
      query: () => ({
        url: "/policy-pages",
        method: "GET",
      }),
      providesTags: ["policyPages"],
    }),

    // Get policy page by ID (Public)
    getPolicyPageById: builder.query<PolicyPageResponse, string>({
      query: (id) => ({
        url: `/policy-pages/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "policyPages", id }],
    }),

    // Get policy page by slug (Public)
    getPolicyPageBySlug: builder.query<PolicyPageResponse, string>({
      query: (slug) => ({
        url: `/policy-pages/slug/${slug}`,
        method: "GET",
      }),
      providesTags: (_, __, slug) => [{ type: "policyPages", id: slug }],
    }),

    // Update policy page (Admin only)
    updatePolicyPage: builder.mutation<
      PolicyPageResponse,
      { id: string; data: UpdatePolicyPageRequest }
    >({
      query: ({ id, data }) => ({
        url: `/policy-pages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "policyPages", id },
        "policyPages",
      ],
    }),

    // Delete policy page (Admin only)
    deletePolicyPage: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/policy-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["policyPages"],
    }),
  }),
});

export const {
  useCreatePolicyPageMutation,
  useGetAllPolicyPagesQuery,
  useGetPolicyPageByIdQuery,
  useGetPolicyPageBySlugQuery,
  useUpdatePolicyPageMutation,
  useDeletePolicyPageMutation,
} = policyApi;
