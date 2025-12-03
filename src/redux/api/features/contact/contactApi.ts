import { baseApi } from "../../baseApi";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    submittedAt: string;
  };
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  success: boolean;
  message: string;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ContactStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalContacts: number;
    todayContacts: number;
    weekContacts: number;
    monthContacts: number;
  };
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Submit contact form (Public)
    submitContact: builder.mutation<ContactResponse, ContactFormData>({
      query: (formData) => ({
        url: "/contact/create",
        method: "POST",
        body: formData,
      }),
    }),

    // Get all contacts (Admin only)
    getAllContacts: builder.query<
      ContactsResponse,
      {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.search) queryParams.append("search", params.search);

        return {
          url: `/contact/all?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["contacts"],
    }),

    // Get contact by ID (Admin only)
    getContactById: builder.query<{ success: boolean; data: Contact }, string>({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "contacts", id }],
    }),

    // Delete contact (Admin only)
    deleteContact: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contacts"],
    }),

    // Get contact statistics (Admin only)
    getContactStats: builder.query<ContactStatsResponse, void>({
      query: () => ({
        url: "/contact/stats",
        method: "GET",
      }),
      providesTags: ["contactStats"],
    }),

    // Get user's own contacts (User only)
    getMyContacts: builder.query<
      { success: boolean; message: string; data: Contact[] },
      void
    >({
      query: () => ({
        url: "/contact/my-contacts",
        method: "GET",
      }),
      providesTags: ["contacts"],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetAllContactsQuery,
  useGetContactByIdQuery,
  useDeleteContactMutation,
  useGetContactStatsQuery,
  useGetMyContactsQuery,
} = contactApi;
