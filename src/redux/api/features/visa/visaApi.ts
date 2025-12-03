import { ICountryVisa } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Visa API endpoints using RTK Query
export const visaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all visas with pagination
    getAllVisas: builder.query<
      {
        success: boolean;
        message: string;
        data: ICountryVisa[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      },
      {
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);

        return {
          url: `/visas?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["visas"],
    }),

    // Get active visas
    getActiveVisas: builder.query<
      {
        success: boolean;
        message: string;
        data: ICountryVisa[];
      },
      void
    >({
      query: () => ({
        url: "/visas/active",
        method: "GET",
      }),
      providesTags: ["visas"],
    }),

    // Get single visa by ID
    getVisaById: builder.query<
      {
        success: boolean;
        message: string;
        data: ICountryVisa;
      },
      string
    >({
      query: (id) => ({
        url: `/visas/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "visas", id }],
    }),

    // Get visa by country name
    getVisaByCountryName: builder.query<
      {
        success: boolean;
        message: string;
        data: ICountryVisa | null;
      },
      string
    >({
      query: (countryName) => ({
        url: `/visas/country/${encodeURIComponent(countryName)}`,
        method: "GET",
      }),
      providesTags: (_, __, countryName) => [
        { type: "visas", id: countryName },
      ],
    }),

    // Create visa
    createVisa: builder.mutation<
      {
        success: boolean;
        message: string;
        data: ICountryVisa;
      },
      Omit<ICountryVisa, "_id" | "createdAt" | "updatedAt">
    >({
      query: (visaData) => ({
        url: "/visas/create",
        method: "POST",
        body: visaData,
      }),
      invalidatesTags: ["visas"],
    }),

    // Update visa
    updateVisa: builder.mutation<
      {
        success: boolean;
        message: string;
        data: ICountryVisa;
      },
      {
        id: string;
        visaData: Partial<ICountryVisa>;
      }
    >({
      query: ({ id, visaData }) => ({
        url: `/visas/${id}`,
        method: "PATCH",
        body: visaData,
      }),
      invalidatesTags: (_, __, { id }) => ["visas", { type: "visas", id }],
    }),

    // Delete visa
    deleteVisa: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/visas/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["visas"],
      }
    ),

    // Toggle visa status
    toggleVisaStatus: builder.mutation<
      {
        success: boolean;
        message: string;
        data: ICountryVisa;
      },
      {
        id: string;
        isActive: boolean;
      }
    >({
      query: ({ id, isActive }) => ({
        url: `/visas/${id}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: (_, __, { id }) => ["visas", { type: "visas", id }],
    }),

    // Reorder visas (Admin only)
    reorderVisas: builder.mutation<
      {
        success: boolean;
        message: string;
        data: ICountryVisa[];
      },
      { visaIds: string[] }
    >({
      query: ({ visaIds }) => ({
        url: "/visas/reorder",
        method: "POST",
        body: { visaIds },
      }),
      invalidatesTags: ["visas"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllVisasQuery,
  useGetActiveVisasQuery,
  useGetVisaByIdQuery,
  useGetVisaByCountryNameQuery,
  useCreateVisaMutation,
  useUpdateVisaMutation,
  useDeleteVisaMutation,
  useToggleVisaStatusMutation,
  useReorderVisasMutation,
} = visaApi;
