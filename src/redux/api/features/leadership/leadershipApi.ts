import { ILeadership } from "@/types/schemas";
import { baseApi } from "../../baseApi";

interface LeadershipHighlightResponse {
  success: boolean;
  message: string;
  data: ILeadership | null;
}

interface LeadershipListResponse {
  success: boolean;
  message: string;
  data: ILeadership[];
}

interface LeadershipMutationResponse {
  success: boolean;
  message: string;
  data: ILeadership;
}

export const leadershipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadershipHighlight: builder.query<LeadershipHighlightResponse, void>({
      query: () => ({
        url: "/leadership",
        method: "GET",
      }),
      providesTags: ["Leadership"],
    }),
    getLeadershipList: builder.query<LeadershipListResponse, void>({
      query: () => ({
        url: "/leadership/all",
        method: "GET",
      }),
      providesTags: ["Leadership"],
    }),
    createLeadership: builder.mutation<LeadershipMutationResponse, FormData>({
      query: (formData) => ({
        url: "/leadership",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Leadership"],
    }),
    updateLeadership: builder.mutation<
      LeadershipMutationResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/leadership/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Leadership",
        { type: "Leadership" as const, id },
      ],
    }),
    deleteLeadership: builder.mutation<
      LeadershipMutationResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/leadership/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leadership"],
    }),
  }),
});

export const {
  useGetLeadershipHighlightQuery,
  useGetLeadershipListQuery,
  useCreateLeadershipMutation,
  useUpdateLeadershipMutation,
  useDeleteLeadershipMutation,
} = leadershipApi;
