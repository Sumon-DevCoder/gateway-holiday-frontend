import { baseApi } from "../../baseApi";

// Tour interfaces matching backend schema exactly
export interface ITour {
  _id?: string;
  code: string;
  title: string;
  // Can be ObjectId string or populated Country object
  destination:
    | string
    | {
        _id: string;
        name: string;
        capital?: string;
        continent?: string;
        flagUrl?: string;
        [key: string]: any;
      };
  duration: {
    days: number;
    nights: number;
  };
  // Can be ObjectId string or populated TourCategory object
  category:
    | string
    | {
        _id: string;
        category_name: string;
        description?: string;
        img?: string;
        [key: string]: any;
      };
  tags: string[];
  highlights: string[];
  inclusion: string[];
  exclusion: string[];
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;
  coverImageUrl?: string;
  coverImageId?: string;
  galleryUrls: string[];
  galleryIds: string[];
  basePrice: number;
  bookingFeePercentage: number;
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
    label?: string;
  };
  itinerary: ItineraryDay[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date;
  order?: number; // manual ordering field for drag-and-drop
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MealData {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface ItineraryBlock {
  type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
  title?: string;
  subtitle?: string;
  description?: string;
  meals?: MealData;
  hotelName?: string;
  timeFrom?: string;
  timeTo?: string;
}

export interface ItineraryDay {
  dayNo: number;
  title: string;
  blocks: ItineraryBlock[];
}

export interface CreateTourRequest {
  code: string;
  title: string;
  destination: string; // Country ObjectId
  duration: {
    days: number;
    nights: number;
  };
  category: string; // TourCategory ObjectId
  tags: string[];
  highlights: string[];
  inclusion: string[];
  exclusion: string[];
  visaRequirements?: string;
  terms?: string;
  otherDetails?: string;
  basePrice: number;
  bookingFeePercentage: number;
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
    label?: string;
  };
  itinerary?: ItineraryDay[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface TourResponse {
  success: boolean;
  message: string;
  data: ITour;
}

export interface TourListResponse {
  success: boolean;
  message: string;
  data: ITour[];
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

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create tour (Admin only)
    createTour: builder.mutation<TourResponse, FormData>({
      query: (formData) => ({
        url: "/tours",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["tours"],
    }),

    // Get all tours with pagination and filtering (Public)
    getTours: builder.query<
      TourListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        destination?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.status) queryParams.append("status", params.status);
        if (params.destination)
          queryParams.append("destination", params.destination);
        if (params.category) queryParams.append("category", params.category);
        if (params.minPrice)
          queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice)
          queryParams.append("maxPrice", params.maxPrice.toString());

        return {
          url: `/tours?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["tours"],
    }),

    // Get tour by ID (Public)
    getTourById: builder.query<TourResponse, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "tours", id }],
    }),

    // // Get tour by slug (Public)
    // getTourBySlug: builder.query<TourResponse, string>({
    //   query: (slug) => ({
    //     url: `/tours/slug/${slug}`,
    //     method: "GET",
    //   }),
    //   providesTags: (_, __, slug) => [{ type: "tours", slug }],
    // }),

    // Update tour (Admin only)
    updateTour: builder.mutation<TourResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "tours", id }, "tours"],
    }),

    // Delete tour (Admin only)
    deleteTour: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/tours/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["tours"],
      }
    ),

    // Get featured tours (Public)
    getFeaturedTours: builder.query<
      { success: boolean; data: ITour[] },
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/tours/featured?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["tours"],
    }),

    // Get recommended tours (Public)
    getRecommendedTours: builder.query<
      { success: boolean; data: ITour[] },
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/tours/recommended?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["tours"],
    }),

    // Get combo tours (Public)
    getComboTours: builder.query<
      { success: boolean; data: ITour[] },
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/tours/combo?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["tours"],
    }),

    // Get tours with active offers (Public)
    getToursWithOffers: builder.query<
      { success: boolean; message: string; data: ITour[] },
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/tours/offers?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["tours"],
    }),

    // Get tours by country (Public)
    getToursByCountry: builder.query<
      { success: boolean; data: ITour[] },
      { countryId: string; limit?: number }
    >({
      query: ({ countryId, limit = 20 }) => {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append("limit", limit.toString());

        return {
          url: `/tours/country/${countryId}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: (_, __, { countryId }) => [
        { type: "tours", id: countryId },
      ],
    }),

    // Reorder tours (Admin only)
    reorderTours: builder.mutation<
      { success: boolean; message: string; data: ITour[] },
      { tourIds: string[] }
    >({
      query: ({ tourIds }) => ({
        url: "/tours/reorder",
        method: "POST",
        body: { tourIds },
      }),
      invalidatesTags: ["tours"],
    }),
  }),
});

export const {
  useCreateTourMutation,
  useGetToursQuery,
  useGetTourByIdQuery,
  // useGetTourBySlugQuery,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetFeaturedToursQuery,
  useGetRecommendedToursQuery,
  useGetComboToursQuery,
  useGetToursWithOffersQuery,
  useGetToursByCountryQuery,
  useReorderToursMutation,
} = tourApi;
