import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePricyPolicy: builder.mutation({
      query: ({ id, description }) => {
        return {
          url: `/privacy/update-privacy/${id}`,
          method: "PATCH",
          body: { description },
        };
      },
    }),
    privacyPolicy: builder.query({
      query: () => {
        return {
          url: "/privacy/get-privacy",
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),
  }),
});

export const { useUpdatePricyPolicyMutation, usePrivacyPolicyQuery } =
  privacyPolicySlice;
