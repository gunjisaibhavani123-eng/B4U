import { baseApi } from '@shared/services/baseApi';

export const budgetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentBudget: builder.query({
      query: () => '/budgets/current',
      providesTags: ['Budget'],
    }),
    createBudget: builder.mutation({
      query: (body) => ({ url: '/budgets', method: 'POST', body }),
      invalidatesTags: ['Budget', 'Dashboard'],
    }),
    updateBudgetCategories: builder.mutation({
      query: ({ id, categories }) => ({
        url: `/budgets/${id}/categories`,
        method: 'PUT',
        body: { categories },
      }),
      invalidatesTags: ['Budget', 'Dashboard'],
    }),
  }),
});

export const {
  useGetCurrentBudgetQuery,
  useCreateBudgetMutation,
  useUpdateBudgetCategoriesMutation,
} = budgetApi;
