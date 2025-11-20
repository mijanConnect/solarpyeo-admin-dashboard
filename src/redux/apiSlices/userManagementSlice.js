import { api } from "../api/baseApi";

const userManagement = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      // accept params: { page, limit, searchTerm, isBan }
      query: ({ page = 1, limit = 10, searchTerm = "", isBan } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (typeof isBan === "boolean") params.append("isBan", isBan);
        return {
          method: "GET",
          url: `/users/management?${params.toString()}`,
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    toggleUserBan: builder.mutation({
      query: ({ id, isBan }) => {
        return {
          method: "PATCH",
          url: `/users/action/${id}`,
          body: { isBan },
        };
      },
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
    createUser: builder.mutation({
      query: (userData) => {
        return {
          method: "POST",
          url: "/users/management",
          body: {
            firstName: userData.firstName,
            middleName: userData.middleName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword,
            provider: "email",
            role: userData.role,
            gender: userData.gender,
            phone: userData.phone,
            address: userData.address,
            birthDate: userData.birthDate,
          },
        };
      },
      transformResponse: (response) => response,
      transformErrorResponse: (response) => response,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useToggleUserBanMutation,
  useCreateUserMutation,
} = userManagement;
