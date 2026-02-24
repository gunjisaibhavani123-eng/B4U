import { baseApi } from '@shared/services/baseApi';

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['User'],
    }),
    updateIncome: builder.mutation({
      query: (body) => ({ url: '/users/me/income', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    updateFixedExpenses: builder.mutation({
      query: (body) => ({ url: '/users/me/fixed-expenses', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    updateDependents: builder.mutation({
      query: (body) => ({ url: '/users/me/dependents', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
    completeOnboarding: builder.mutation({
      query: () => ({ url: '/users/me/complete-onboarding', method: 'POST' }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUpdateIncomeMutation,
  useUpdateFixedExpensesMutation,
  useUpdateDependentsMutation,
  useCompleteOnboardingMutation,
} = onboardingApi;
