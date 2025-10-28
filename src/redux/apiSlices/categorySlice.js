import { api } from "../api/baseApi";

const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/category/create-category",
          method: "POST",
          body: categoryData,
        };
      },
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/category/update-category/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/category/delete-category/${id}`,
          method: "DELETE",
        };
      },
    }),
    category: builder.query({
      query: () => {
        return {
          url: "/category/get-category",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorySlice;
