import { api } from "../api/baseApi";

// Endpoint to fetch initial submissions with server pagination and optional filters
export const misuseSubmissionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMisuseSubmissions: build.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/submission/misuse?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["MisuseSubmission"],
    }),

    getSubmissionById: build.query({
      query: (id) => ({
        url: `/submission/misuse/${id}`,
        method: "GET",
      }),
      providesTags: ["MisuseSubmission"],
    }),

    updateMisuseSubmission: build.mutation({
      query: ({ id, body }) => ({
        url: `/submission/misuse/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["MisuseSubmission"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMisuseSubmissionsQuery,
  useUpdateMisuseSubmissionMutation,
  useGetSubmissionByIdQuery,
} = misuseSubmissionApi;
