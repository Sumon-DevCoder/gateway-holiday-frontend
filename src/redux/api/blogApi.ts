import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogCategories: builder.query({
      query: () => {
        return {
          url: "/blogs/categories",
          method: "GET",
        };
      },
      providesTags: ["blogCategories"],
    }),

    createBlog: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("categoryName", data.categoryName);
        formData.append("content", data.content);
        formData.append("tags", data.tags);
        formData.append("readTime", data.readTime);
        formData.append("status", data.status);

        if (data.coverImage) {
          formData.append("coverImage", data.coverImage);
        } else {
        }

        return {
          url: "/blogs/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["blogs"],
    }),

    updateBlog: builder.mutation({
      query: (args) => {
        const formData = new FormData();
        formData.append("title", args.data.title);
        formData.append("categoryName", args.data.categoryName);
        formData.append("content", args.data.content);
        formData.append("tags", args.data.tags);
        formData.append("readTime", args.data.readTime);
        formData.append("status", args.data.status);
        if (args.data.coverImage) {
          formData.append("coverImage", args.data.coverImage);
        }

        return {
          url: `/blogs/${args.id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["blogs", "singleBlog"],
    }),

    updateBlogStatus: builder.mutation({
      query: (args) => ({
        url: `/blogs/${args.id}`,
        method: "PATCH",
        body: { status: args.status },
      }),
      invalidatesTags: ["blogs", "singleBlog"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),

    getAllBlogs: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/blogs",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["blogs"],
    }),

    getSingleBlog: builder.query({
      query: (blogId: string) => {
        return {
          url: `/blogs/${blogId}`,
          method: "GET",
        };
      },
      providesTags: ["singleBlog"],
    }),

    // Category Management APIs
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/blogs/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogCategories"],
    }),

    getSingleCategory: builder.query({
      query: (categoryId: string) => {
        return {
          url: `/blogs/categories/${categoryId}`,
          method: "GET",
        };
      },
      providesTags: ["singleCategory"],
    }),

    updateCategory: builder.mutation({
      query: (args) => ({
        url: `/blogs/categories/${args.id}`,
        method: "PATCH",
        body: args.data,
      }),
      invalidatesTags: ["blogCategories", "singleCategory"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/blogs/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogCategories"],
    }),

    // Reorder blogs (Admin only)
    reorderBlogs: builder.mutation({
      query: (data) => ({
        url: "/blogs/reorder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useGetBlogCategoriesQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useUpdateBlogStatusMutation,
  useDeleteBlogMutation,
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useCreateCategoryMutation,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderBlogsMutation,
} = blogApi;
