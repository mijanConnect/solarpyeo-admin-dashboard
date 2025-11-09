import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const appealSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAppealSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/appeal?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["AppealSubmission"],
    }),

    getSubmissionById: build.query({
      query: (id) => ({
        url: `/submission/appeal/${id}`,
        method: "GET",
      }),
      providesTags: ["AppealSubmission"],
    }),

    updateSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/appeal/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AppealSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAppealSubmissionsQuery,
  useUpdateSubmissionMutation,
  useGetSubmissionByIdQuery,
} = appealSubmissionApi;
