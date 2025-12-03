import { baseApi } from "../../baseApi";

export interface DashboardStats {
  users: {
    total: number;
    recent: number;
  };
  queries: {
    total: number;
    recent: number;
  };
  reviews: {
    total: number;
    recent: number;
  };
  blogs: {
    total: number;
    recent: number;
  };
  team: {
    total: number;
    recent: number;
  };
  contacts: {
    total: number;
    recent: number;
  };
  visas: {
    total: number;
    recent: number;
  };
  gallery: {
    total: number;
    recent: number;
  };
  banners: {
    total: number;
  };
  tours: {
    total: number;
    recent: number;
  };
  faqs: {
    total: number;
    active: number;
  };
  customTourQueries: {
    total: number;
    recent: number;
  };
  bookings?: {
    total: number;
    recent: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface MonthlyRevenueResponse {
  success: boolean;
  message: string;
  data: MonthlyRevenueData[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
    getMonthlyRevenue: builder.query<MonthlyRevenueResponse, number | void>({
      query: (months = 6) => ({
        url: `/dashboard/monthly-revenue?months=${months}`,
        method: "GET",
      }),
      providesTags: ["MonthlyRevenue"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetMonthlyRevenueQuery } =
  dashboardApi;
