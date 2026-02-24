import { baseApi } from '@shared/services/baseApi';

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: ({ month, year, page = 1, pageSize = 20 }) =>
        `/expenses?month=${month}&year=${year}&page=${page}&page_size=${pageSize}`,
      providesTags: ['Expenses'],
    }),
    getExpenseBreakdown: builder.query({
      query: ({ month, year }) =>
        `/expenses/summary/breakdown?month=${month}&year=${year}`,
      providesTags: ['Expenses'],
    }),
    addExpense: builder.mutation({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: ['Expenses', 'Dashboard', 'Budget'],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/expenses/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Expenses', 'Dashboard', 'Budget'],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Expenses', 'Dashboard', 'Budget'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseBreakdownQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
