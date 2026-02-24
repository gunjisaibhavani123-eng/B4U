import { baseApi } from '@shared/services/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi;
