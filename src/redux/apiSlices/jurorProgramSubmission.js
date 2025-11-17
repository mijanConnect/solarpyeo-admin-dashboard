import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const jurorProgramSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getJurorProgramSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/jurorProgram?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["JurorProgramSubmission"],
    }),
    updateJurorProgramSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/jurorProgram/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["JurorProgramSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJurorProgramSubmissionsQuery,
  useUpdateJurorProgramSubmissionMutation,
} = jurorProgramSubmissionApi;
