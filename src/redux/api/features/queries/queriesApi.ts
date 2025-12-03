import {
  CreateQueryRequest,
  IQuery,
  QueriesResponse,
  QueryFilters,
  QueryStats,
  UpdateQueryRequest,
} from "@/types/queries";
import { baseApi } from "../../baseApi";

// Queries API endpoints
export const queriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all queries with pagination and filters
    getQueries: builder.query<QueriesResponse, QueryFilters>({
      query: (params) => ({
        url: "/queries/all",
        params,
      }),
      providesTags: ["queries"],
    }),

    // Get query by ID
    getSingleQuery: builder.query<IQuery, string>({
      query: (id) => ({
        url: `/queries/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "queries", id }],
    }),

    // Get queries by form type
    getQueriesByFormType: builder.query<
      QueriesResponse,
      { formType: string; page?: number; limit?: number }
    >({
      query: ({ formType, page = 1, limit = 10 }) => ({
        url: `/queries/form-type/${formType}`,
        params: { page, limit },
      }),
      providesTags: (_, __, { formType }) => [
        { type: "queries", id: formType },
      ],
    }),

    // Get query statistics
    getQueryStats: builder.query<QueryStats, void>({
      query: () => ({
        url: "/queries/stats",
      }),
      providesTags: ["queryStats"],
    }),

    // Create new query (public endpoint)
    createQuery: builder.mutation<
      { success: boolean; message: string; data: Partial<IQuery> },
      CreateQueryRequest
    >({
      query: (data) => ({
        url: "/queries/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["queries", "queryStats"],
    }),

    // Update query (admin only)
    updateQuery: builder.mutation<
      { success: boolean; message: string; data: IQuery },
      { id: string; data: UpdateQueryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/queries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "queries", id },
        "queries",
        "queryStats",
      ],
    }),

    // Delete query (admin only)
    deleteQuery: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/queries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "queries", id },
        "queries",
        "queryStats",
      ],
    }),

    // Get user's own queries (User only)
    getMyQueries: builder.query<
      { success: boolean; message: string; data: IQuery[] },
      void
    >({
      query: () => ({
        url: "/queries/my-queries",
        method: "GET",
      }),
      providesTags: ["queries"],
    }),
  }),
});

export const {
  // Query hooks
  useGetQueriesQuery,
  useGetSingleQueryQuery,
  useGetQueriesByFormTypeQuery,
  useGetQueryStatsQuery,
  useCreateQueryMutation,
  useUpdateQueryMutation,
  useDeleteQueryMutation,
  useGetMyQueriesQuery,
} = queriesApi;
