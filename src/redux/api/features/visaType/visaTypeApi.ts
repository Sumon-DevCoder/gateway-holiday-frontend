import { baseApi as api } from "../../baseApi";

export interface IVisaType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateVisaTypeRequest {
  name: string;
  isActive?: boolean;
}

interface UpdateVisaTypeRequest {
  name?: string;
  isActive?: boolean;
}

interface ToggleStatusRequest {
  isActive: boolean;
}

export const visaTypeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all visa types (with pagination)
    getAllVisaTypes: builder.query({
      query: (params = {}) => ({
        url: "/visa-types",
        params,
      }),
      transformResponse: (response: any) => response,
      providesTags: ["VisaType"],
    }),

    // Get active visa types only
    getActiveVisaTypes: builder.query<IVisaType[], void>({
      query: () => ({
        url: "/visa-types/active",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data || [],
      providesTags: ["VisaType"],
    }),

    // Get single visa type
    getSingleVisaType: builder.query<IVisaType, string>({
      query: (id) => ({
        url: `/visa-types/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (_result, _error, id) => [{ type: "VisaType", id }],
    }),

    // Create visa type
    createVisaType: builder.mutation<IVisaType, CreateVisaTypeRequest>({
      query: (data) => ({
        url: "/visa-types",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["VisaType"],
    }),

    // Update visa type
    updateVisaType: builder.mutation<
      IVisaType,
      { id: string; data: UpdateVisaTypeRequest }
    >({
      query: ({ id, data }) => ({
        url: `/visa-types/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "VisaType", id },
        "VisaType",
      ],
    }),

    // Delete visa type
    deleteVisaType: builder.mutation<IVisaType, string>({
      query: (id) => ({
        url: `/visa-types/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["VisaType"],
    }),

    // Toggle visa type status
    toggleVisaTypeStatus: builder.mutation<
      IVisaType,
      { id: string; data: ToggleStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/visa-types/${id}/toggle-status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "VisaType", id },
        "VisaType",
      ],
    }),
  }),
});

export const {
  useGetAllVisaTypesQuery,
  useGetActiveVisaTypesQuery,
  useGetSingleVisaTypeQuery,
  useCreateVisaTypeMutation,
  useUpdateVisaTypeMutation,
  useDeleteVisaTypeMutation,
  useToggleVisaTypeStatusMutation,
} = visaTypeApi;
