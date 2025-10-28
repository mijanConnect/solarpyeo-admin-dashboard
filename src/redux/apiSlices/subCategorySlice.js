import { api } from "../api/baseApi";

const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createSubCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/subCategory/create-sub-category",
          method: "POST",
          body: categoryData,
        };
      },
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/subCategory/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
    }),
    deleteSubCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/subCategory/${id}`,
          method: "DELETE",
        };
      },
    }),
    getSubCategories: builder.query({
      query: () => {
        return {
          url: "/subCategory",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategorySlice;
