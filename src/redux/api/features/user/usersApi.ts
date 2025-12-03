import {
  ApiResponse,
  ChangeUserRoleRequest,
  ChangeUserStatusRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserFilters,
  UsersResponse,
  UserStats,
} from "@/types/user";
import { baseApi } from "../../baseApi";

// Users API endpoints
export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<UsersResponse, UserFilters>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "users" as const,
                id: _id,
              })),
              { type: "users" as const, id: "LIST" },
            ]
          : [{ type: "users" as const, id: "LIST" }],
    }),

    // Get user by ID
    getSingleUser: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: (_, __, id) => [{ type: "users", id }],
    }),

    // Get user statistics
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => ({
        url: "/users/stats",
      }),
      providesTags: ["userStats"],
    }),

    // Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "users", id: "LIST" }, "userStats"],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "users", id },
        { type: "users", id: "LIST" },
        "userStats",
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "users", id },
        { type: "users", id: "LIST" },
        "userStats",
      ],
    }),

    // Change user status
    changeUserStatus: builder.mutation<
      ApiResponse<User>,
      { id: string; data: ChangeUserStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "users", id },
        { type: "users", id: "LIST" },
        "userStats",
      ],
    }),

    // Change user role
    changeUserRole: builder.mutation<
      ApiResponse<User>,
      { id: string; data: ChangeUserRoleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "users", id },
        { type: "users", id: "LIST" },
        "userStats",
      ],
    }),
  }),
});

export const {
  // Query hooks
  useGetUsersQuery,
  useGetSingleUserQuery,
  useGetUserStatsQuery,

  // Mutation hooks
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
  useChangeUserRoleMutation,
} = usersApi;
