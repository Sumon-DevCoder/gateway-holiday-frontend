import { TQueryParam } from "@/types";
import { baseApi } from "../../baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/products",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["products"],
    }),

    getSingleProduct: builder.query({
      query: (productId: string) => {
        return {
          url: `/products/${productId}`,
          method: "GET",
        };
      },
      providesTags: ["singleProduct"],
    }),

    getAllCategories: builder.query({
      query: () => {
        return {
          url: "products/categories/all-categories",
          method: "GET",
        };
      },
      providesTags: ["categories"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: (args) => ({
        url: `/products/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["products", "singleProduct"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetAllCategoriesQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
