import {
  CountryListResponse,
  CountryResponse,
  CreateCountryData,
  ICountry,
  ReorderCountriesRequest,
  ReorderCountriesResponse,
  UpdateCountryData,
} from "../../../../types/country";
import { baseApi } from "../../baseApi";

export const countryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create country (Admin only)
    createCountry: builder.mutation<CountryResponse, CreateCountryData>({
      query: (formData) => ({
        url: "/countries",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["countries"],
    }),

    // Create country with image uploads (Admin only)
    createCountryWithImages: builder.mutation<CountryResponse, FormData>({
      query: (formData) => ({
        url: "/countries",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["countries"],
    }),

    // Get all countries with pagination and filtering (Public)
    getCountries: builder.query<
      CountryListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        isTop?: string | boolean;
      }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (
          params.isTop !== undefined &&
          params.isTop !== null &&
          params.isTop !== ""
        ) {
          queryParams.append("isTop", String(params.isTop));
        }

        return {
          url: `/countries?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["countries"],
    }),

    // Get country by ID (Public)
    getCountryById: builder.query<CountryResponse, string>({
      query: (id) => ({
        url: `/countries/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: "countries", id }],
    }),

    // Update country (Admin only)
    updateCountry: builder.mutation<
      CountryResponse,
      { id: string; data: UpdateCountryData }
    >({
      query: ({ id, data }) => ({
        url: `/countries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "countries", id },
        "countries",
      ],
    }),

    // Update country with image uploads (Admin only)
    updateCountryWithImages: builder.mutation<
      CountryResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/countries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "countries", id },
        "countries",
      ],
    }),

    // Delete country (Admin only)
    deleteCountry: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/countries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["countries"],
    }),

    // Search countries (Public)
    searchCountries: builder.query<
      { success: boolean; data: ICountry[] },
      string
    >({
      query: (searchTerm) => ({
        url: `/countries/search?q=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      providesTags: ["countries"],
    }),

    // Get popular countries (Public)
    getPopularCountries: builder.query<
      { success: boolean; data: ICountry[] },
      { limit?: number }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());

        return {
          url: `/countries/popular?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["countries"],
    }),

    // Get countries with published tours (Public)
    getCountriesWithTours: builder.query<
      { success: boolean; message: string; data: ICountry[] },
      void
    >({
      query: () => ({
        url: "/countries/with-tours",
        method: "GET",
      }),
      providesTags: ["countries"],
    }),

    // Get countries with active visas (Public)
    getCountriesWithVisas: builder.query<
      { success: boolean; message: string; data: ICountry[] },
      void
    >({
      query: () => ({
        url: "/countries/with-visas",
        method: "GET",
      }),
      providesTags: ["countries"],
    }),

    // Reorder countries (Admin only)
    reorderCountries: builder.mutation<
      ReorderCountriesResponse,
      ReorderCountriesRequest
    >({
      query: (data) => ({
        url: "/countries/reorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["countries"],
    }),
  }),
});

export const {
  useCreateCountryMutation,
  useCreateCountryWithImagesMutation,
  useGetCountriesQuery,
  useGetCountryByIdQuery,
  useUpdateCountryMutation,
  useUpdateCountryWithImagesMutation,
  useDeleteCountryMutation,
  useSearchCountriesQuery,
  useGetPopularCountriesQuery,
  useGetCountriesWithToursQuery,
  useGetCountriesWithVisasQuery,
  useReorderCountriesMutation,
} = countryApi;
