/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { toast } from "sonner";
import { logout, setToken } from "../authSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env["NEXT_PUBLIC_API_URL"]!,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state first
    const reduxToken = (getState() as RootState).auth.token;

    // Fallback to cookies if Redux token is not available
    let token = reduxToken;
    if (!token && typeof window !== "undefined") {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
      token = cookieToken || null;
    }

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      // Refresh token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      );

      const refreshData = refreshResult?.data as {
        data: { accessToken: string };
        success: boolean;
        message: string;
      };

      if (refreshData.success) {
        // Set new access token
        api.dispatch(setToken(refreshData.data.accessToken));
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout()); // logging out the user
        // Only show toast if not already shown to prevent multiple toasts
        toast.error("Login Expired", { id: "auth-expired" });
      }
    }

    return result;
  } catch {
    // Only show toast if not already shown to prevent multiple toasts
    toast.error("Login Expired", { id: "auth-expired" });
    api.dispatch(logout());
    return { error: { status: 500, message: "An unexpected error occurred" } };
  }
};

const productTags = ["products", "singleProduct", "categories"];
const userTags = ["user", "users", "userStats"];
const contactTags = ["contacts", "contactStats"];
const newsletterTags = ["newsletters", "newsletterStats"];
const reviewTags = ["reviews"];
const teamTags = ["Team"];
const leadershipTags = ["Leadership"];
const companyInfoTags = ["companyInfo"];
const companyImagesTags = ["CompanyImages"];
const countryTags = ["countries"];
const bannerTags = ["banners"];
const visaTags = ["visas"];
const galleryTags = [
  "galleryCategories",
  "gallerySubCategories",
  "galleryImages",
];
const queryTags = ["queries", "queryStats"];
const blogTags = ["blogCategories", "blogs", "singleBlog"];
const tourTags = ["tours"];
const tourCategoryTags = ["tourCategories"];
const policyTags = ["policyPages"];
const authorizationTags = ["authorizations"];
const faqTags = ["faqs", "faqStats", "activeFaqs"];
const packageTags = ["packages"];
const customTourQueryTags = ["customTourQueries"];
const visaBookingTags = ["visaBookings", "visaBookingStats"];
const visaTypeTags = ["VisaType"];
const dashboardTags = ["DashboardStats", "MonthlyRevenue"];
const bookingTags = ["bookings", "bookingStats"];

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithToken,
  tagTypes: [
    ...productTags,
    ...userTags,
    ...blogTags,
    ...contactTags,
    ...newsletterTags,
    ...reviewTags,
    ...teamTags,
    ...leadershipTags,
    ...companyInfoTags,
    ...companyImagesTags,
    ...countryTags,
    ...bannerTags,
    ...visaTags,
    ...galleryTags,
    ...queryTags,
    ...tourTags,
    ...tourCategoryTags,
    ...policyTags,
    ...authorizationTags,
    ...faqTags,
    ...packageTags,
    ...customTourQueryTags,
    ...visaBookingTags,
    ...visaTypeTags,
    ...dashboardTags,
    ...bookingTags,
  ],
  endpoints: () => ({}),
});
