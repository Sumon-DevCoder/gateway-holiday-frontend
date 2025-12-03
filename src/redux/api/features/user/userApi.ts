import { baseApi } from "../../baseApi";

interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profileImg?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: userInfo,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetPasswordData, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: resetPasswordData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // Updated profile endpoints
    updateProfile: builder.mutation({
      query: (profileData: UpdateProfileData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(
        _profileData,
        { dispatch, queryFulfilled, getState }
      ) {
        try {
          const { data } = await queryFulfilled;
          // Update the auth state with the returned user data
          if (data?.data) {
            const state = getState() as any;
            const currentToken = state.auth?.token;
            dispatch({
              type: "auth/setUser",
              payload: { user: data.data, token: currentToken },
            });
          }
        } catch (error) {
          // Handle error if needed
        }
      },
    }),

    changePassword: builder.mutation({
      query: (passwordData: ChangePasswordData) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    uploadProfileImage: builder.mutation({
      query: (file: File) => {
        const formData = new FormData();
        formData.append("profileImg", file);
        return {
          url: "/auth/upload-profile-image",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["user"],
      async onQueryStarted(_file, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          // Update the auth state with the returned user data
          if (data?.data) {
            const state = getState() as any;
            const currentToken = state.auth?.token;
            dispatch({
              type: "auth/setUser",
              payload: { user: data.data, token: currentToken },
            });
          }
        } catch (error) {
          // Handle error if needed
        }
      },
    }),

    deleteUser: builder.mutation({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),

    getSingleUser: builder.query({
      query: (userId: string) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
    }),

    // Legacy endpoints (keeping for backward compatibility)
    changeProfile: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-profile/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),
    changeCover: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-cover/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadProfileImageMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useChangeCoverMutation,
  useChangeProfileMutation,
  useLogoutMutation,
} = authApi;
