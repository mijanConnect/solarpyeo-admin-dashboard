import { api } from "../api/baseApi";

const reportSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    analytics: builder.query({
      // args: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.startDate) params.append("startDate", args.startDate);
        if (args?.endDate) params.append("endDate", args.endDate);
        return {
          url: `/report/analytics?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
    }),
  }),
});

export const { useAnalyticsQuery } = reportSlice;
