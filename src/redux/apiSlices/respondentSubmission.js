import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const respondentSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRespondentSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/respondent?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["RespondentSubmission"],
    }),

    getRespondentSubmissionById: build.query({
      query: (id) => ({
        url: `/submission/respondent/${id}`,
        method: "GET",
      }),
      providesTags: ["RespondentSubmission"],
    }),

    updateRespondentSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/respondent/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["RespondentSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRespondentSubmissionsQuery,
  useUpdateRespondentSubmissionMutation,
  useGetRespondentSubmissionByIdQuery,
} = respondentSubmissionApi;
