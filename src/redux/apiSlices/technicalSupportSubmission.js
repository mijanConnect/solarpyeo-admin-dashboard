import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const technicalSupportSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTechnicalSupportSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/technicalSupport?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["TechnicalSupportSubmission"],
    }),
    updateTechnicalSupportSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/technicalSupport/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["TechnicalSupportSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTechnicalSupportSubmissionsQuery,
  useUpdateTechnicalSupportSubmissionMutation,
} = technicalSupportSubmissionApi;
