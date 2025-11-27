import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://10.10.7.44:5000/api/v1";
// const baseUrl = "https://api.glassfile.xyz/api/v1";

// Base query with auth headers
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (err) {
      console.error("Error preparing headers:", err);
    }
    return headers;
  },
});

// Wrapper to handle 401 errors - clear tokens and redirect to login
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If we get a 401 (unauthorized), clear tokens and redirect to login
  if (result?.error && result.error.status === 401) {
    // Clear all auth tokens
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // Avoid redirect loops: only redirect if not already on an /auth route
    try {
      const pathname = window?.location?.pathname || "";
      if (!pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    } catch (e) {
      // Fallback: do a redirect if reading location fails
      window.location.href = "/auth/login";
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Profile", "InitialSubmission"],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export const imageUrl = "http://10.10.7.46:5000";
