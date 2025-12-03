import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { TUser } from "../types";
import { RootState } from "./store";

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      Cookies.set("accessToken", token, { expires: 30 });
    },
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set("accessToken", action.payload, { expires: 30 });
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove token from cookies
      Cookies.remove("accessToken");

      // Force clear any cached data
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:auth");
        sessionStorage.removeItem("persist:auth");
      }
    },
  },
});

export const { setUser, logout, setToken } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentUser = (state: RootState) => state.auth.user;
