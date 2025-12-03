import { ITeam } from "@/types/schemas";
import { baseApi } from "../../baseApi";

// Inject team API endpoints
export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all team members with pagination
    getTeamMembers: builder.query<
      {
        success: boolean;
        data: ITeam[];
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
          url: `/teams?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Team"],
    }),

    // Get single team member
    getTeamMember: builder.query<{ success: boolean; data: ITeam }, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Team", id }],
    }),

    // Create team member with file upload
    createTeamMember: builder.mutation<
      { success: boolean; data: ITeam },
      FormData
    >({
      query: (formData) => ({
        url: "/teams",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Team"],
    }),

    // Create team member with image URL
    createTeamMemberWithUrl: builder.mutation<
      { success: boolean; data: ITeam },
      Partial<ITeam>
    >({
      query: (teamData) => ({
        url: "/teams/with-url",
        method: "POST",
        body: teamData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Team"],
    }),

    // Update team member with file upload
    updateTeamMember: builder.mutation<
      { success: boolean; data: ITeam },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/teams/${id}/with-image`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Team", id }, "Team"],
    }),

    // Update team member with image URL
    updateTeamMemberWithUrl: builder.mutation<
      { success: boolean; data: ITeam },
      { id: string; data: Partial<ITeam> }
    >({
      query: ({ id, data }) => ({
        url: `/teams/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Team", id }, "Team"],
    }),

    // Delete team member
    deleteTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),

    // Reorder team members
    reorderTeamMembers: builder.mutation<
      { success: boolean; data: ITeam[] },
      { teamIds: string[] }
    >({
      query: ({ teamIds }) => ({
        url: "/teams/reorder",
        method: "PATCH",
        body: { teamIds },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useGetTeamMemberQuery,
  useCreateTeamMemberMutation,
  useCreateTeamMemberWithUrlMutation,
  useUpdateTeamMemberMutation,
  useUpdateTeamMemberWithUrlMutation,
  useDeleteTeamMemberMutation,
  useReorderTeamMembersMutation,
} = teamApi;
