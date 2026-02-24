import { baseApi } from '@shared/services/baseApi';

export const nudgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkNudge: builder.mutation({
      query: (body) => ({ url: '/nudge/check', method: 'POST', body }),
    }),
  }),
});

export const { useCheckNudgeMutation } = nudgeApi;
