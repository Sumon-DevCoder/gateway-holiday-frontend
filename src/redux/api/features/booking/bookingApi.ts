import { baseApi } from "../../baseApi";

export interface CreateBookingData {
  name: string;
  email?: string;
  phone: string;
  message?: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  duration: number;
  validFrom: string;
  validTo: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: boolean;
  bookingFee: number;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    bookingId: string;
    transactionId: string;
    paymentUrl: string;
    sessionKey: string;
    booking: {
      name: string;
      email?: string;
      tourTitle: string;
      travelDate: string;
      persons: number;
      bookingFee: number;
      bookingStatus: string;
      paymentStatus: string;
    };
  };
}

export interface Booking {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  tourId: string;
  tourTitle: string;
  destination: string;
  duration: number;
  validFrom: string;
  validTo: string;
  travelDate: string;
  persons: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  needsVisa?: boolean;
  bookingFee: number;
  transactionId: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentGateway?: string;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  sslcommerz: {
    sessionKey?: string;
    GatewayPageURL?: string;
    transactionId?: string;
    amount?: number;
    currency?: string;
    bankTransactionId?: string;
    cardType?: string;
    cardNo?: string;
    cardIssuer?: string;
    cardBrand?: string;
    status?: string;
  };
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

export interface BookingsListResponse {
  success: boolean;
  message: string;
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BookingDetailResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export interface BookingStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    todayBookings: number;
    weekBookings: number;
    monthBookings: number;
  };
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    isValid: boolean;
    booking: Booking;
  };
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create booking and initiate payment (Public)
    createBooking: builder.mutation<BookingResponse, CreateBookingData>({
      query: (bookingData) => ({
        url: "/bookings/create",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["bookings", "bookingStats"],
    }),

    // Verify payment (Public)
    verifyPayment: builder.query<PaymentVerificationResponse, string>({
      query: (transactionId) => ({
        url: `/bookings/verify/${transactionId}`,
        method: "GET",
      }),
    }),

    // Get booking by transaction ID (Public)
    getBookingByTransactionId: builder.query<BookingDetailResponse, string>({
      query: (transactionId) => ({
        url: `/bookings/transaction/${transactionId}`,
        method: "GET",
      }),
      providesTags: (_, __, transactionId) => [
        { type: "bookings", id: transactionId },
      ],
    }),

    // Get all bookings (Admin only)
    getAllBookings: builder.query<
      BookingsListResponse,
      {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
        paymentStatus?: string;
        bookingStatus?: string;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        if (params.search) queryParams.append("search", params.search);
        if (params.paymentStatus)
          queryParams.append("paymentStatus", params.paymentStatus);
        if (params.bookingStatus)
          queryParams.append("bookingStatus", params.bookingStatus);

        return {
          url: `/bookings?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["bookings"],
    }),

    // Get booking by ID (Admin only)
    getBookingById: builder.query<BookingDetailResponse, string>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "bookings", id }],
    }),

    // Update booking status (Admin only)
    updateBookingStatus: builder.mutation<
      BookingDetailResponse,
      {
        id: string;
        bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
      }
    >({
      query: ({ id, bookingStatus }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { bookingStatus },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "bookings", id },
        "bookings",
        "bookingStats",
      ],
    }),

    // Delete booking (Admin only)
    deleteBooking: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "bookings", id },
        "bookings",
        "bookingStats",
      ],
    }),

    // Get booking statistics (Admin only)
    getBookingStats: builder.query<BookingStatsResponse, void>({
      query: () => ({
        url: "/bookings/stats",
        method: "GET",
      }),
      providesTags: ["bookingStats"],
    }),

    // Get user's own bookings (User only)
    getMyBookings: builder.query<BookingsListResponse, void>({
      query: () => ({
        url: "/bookings/my-bookings",
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useVerifyPaymentQuery,
  useGetBookingByTransactionIdQuery,
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetBookingStatsQuery,
  useGetMyBookingsQuery,
} = bookingApi;
