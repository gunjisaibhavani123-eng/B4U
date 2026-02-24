import { baseApi } from '@shared/services/baseApi';

export const goalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGoals: builder.query({
      query: () => '/goals',
      providesTags: ['Goals'],
    }),
    getGoalDetail: builder.query({
      query: (id) => `/goals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Goals', id }],
    }),
    createGoal: builder.mutation({
      query: (body) => ({ url: '/goals', method: 'POST', body }),
      invalidatesTags: ['Goals', 'Dashboard'],
    }),
    updateGoal: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/goals/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Goals', 'Dashboard'],
    }),
    deleteGoal: builder.mutation({
      query: (id) => ({ url: `/goals/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Goals', 'Dashboard'],
    }),
    addContribution: builder.mutation({
      query: ({ goalId, ...body }) => ({
        url: `/goals/${goalId}/contributions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Goals', 'Dashboard'],
    }),
  }),
});

export const {
  useGetGoalsQuery,
  useGetGoalDetailQuery,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useAddContributionMutation,
} = goalApi;
