import { TUser } from "@/types";
import { baseApi } from "../../baseApi";

// Auth API interfaces
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: TUser;
  token: string;
}

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register new user
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // Login user
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // Refresh token
    refreshToken: builder.mutation<
      { success: boolean; data: { accessToken: string } },
      void
    >({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
} = authApi;
