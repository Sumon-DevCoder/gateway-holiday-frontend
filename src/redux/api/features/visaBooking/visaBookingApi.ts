import {
  CreateVisaBookingInput,
  UpdateVisaBookingStatusInput,
  VisaBooking,
  VisaBookingStats,
} from "@/types/visaBooking";
import { baseApi } from "../../baseApi";

export interface VisaBookingResponse {
  success: boolean;
  message: string;
  data: VisaBooking;
}

export interface VisaBookingListResponse {
  success: boolean;
  message: string;
  data: VisaBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    next?: number;
    prev?: number;
  };
}

export interface VisaBookingStatsResponse {
  success: boolean;
  message: string;
  data: VisaBookingStats;
}

export interface VisaApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationId: string;
    transactionId: string;
    paymentUrl: string;
    sessionKey: string;
    application: {
      country: string;
      visaType: string;
      name: string;
      processingFee: number;
      paymentStatus: string;
    };
  };
}

export interface CreateVisaApplicationInput {
  country: string;
  visaType: string;
  booking_type?: "application";
  name: string;
  email?: string | undefined;
  phone: string;
  numberOfPersons?: number;
  processingFee: number;
}

export const visaBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create visa booking (Query type - no payment)
    createVisaBooking: builder.mutation<
      VisaBookingResponse,
      CreateVisaBookingInput
    >({
      query: (data) => ({
        url: "/visa-bookings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["visaBookings", "visaBookingStats"],
    }),

    // Create visa application (Application type - with payment)
    createVisaApplication: builder.mutation<
      VisaApplicationResponse,
      CreateVisaApplicationInput
    >({
      query: (data) => ({
        url: "/visa-bookings/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["visaBookings", "visaBookingStats"],
    }),

    // Get all visa bookings (Admin only)
    getVisaBookings: builder.query<
      VisaBookingListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        booking_type?: string;
        country?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.booking_type)
          queryParams.append("booking_type", params.booking_type);
        if (params.country) queryParams.append("country", params.country);

        return {
          url: `/visa-bookings?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["visaBookings"],
    }),

    // Get visa booking by ID (Admin only)
    getVisaBookingById: builder.query<VisaBookingResponse, string>({
      query: (id) => ({
        url: `/visa-bookings/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "visaBookings", id }],
    }),

    // Update visa booking status (Admin only)
    updateVisaBookingStatus: builder.mutation<
      VisaBookingResponse,
      {
        id: string;
        data: UpdateVisaBookingStatusInput;
      }
    >({
      query: ({ id, data }) => ({
        url: `/visa-bookings/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "visaBookings", id },
        "visaBookings",
        "visaBookingStats",
      ],
    }),

    // Delete visa booking (Admin only)
    deleteVisaBooking: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/visa-bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["visaBookings", "visaBookingStats"],
    }),

    // Get statistics (Admin only)
    getVisaBookingStats: builder.query<VisaBookingStatsResponse, void>({
      query: () => ({
        url: "/visa-bookings/stats",
        method: "GET",
      }),
      providesTags: ["visaBookings", "visaBookingStats"],
    }),

    // Get user's own visa bookings (User only)
    getMyVisaBookings: builder.query<
      { success: boolean; message: string; data: VisaBooking[] },
      void
    >({
      query: () => ({
        url: "/visa-bookings/my-bookings",
        method: "GET",
      }),
      providesTags: ["visaBookings"],
    }),
  }),
});

export const {
  useCreateVisaBookingMutation,
  useCreateVisaApplicationMutation,
  useGetVisaBookingsQuery,
  useGetVisaBookingByIdQuery,
  useUpdateVisaBookingStatusMutation,
  useDeleteVisaBookingMutation,
  useGetVisaBookingStatsQuery,
  useGetMyVisaBookingsQuery,
} = visaBookingApi;
