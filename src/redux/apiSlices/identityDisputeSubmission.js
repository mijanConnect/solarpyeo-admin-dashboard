import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const identityDisputeSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIdentityDisputeSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/mistakerClaimForm?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["IdentityDisputeSubmission"],
    }),
    updateIdentityDisputeSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/mistakerClaimForm/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["IdentityDisputeSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIdentityDisputeSubmissionsQuery,
  useUpdateIdentityDisputeSubmissionMutation,
} = identityDisputeSubmissionApi;
