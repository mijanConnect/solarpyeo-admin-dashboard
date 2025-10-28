import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => {
        return {
          url: `/notifications`,
          method: "GET",
        };
      },
    }),
    read: builder.mutation({
      query: () => {
        return {
          url: `/notifications`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useNotificationQuery, useReadMutation } = notificationSlice;
