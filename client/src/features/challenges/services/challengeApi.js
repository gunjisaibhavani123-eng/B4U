import { baseApi } from '@shared/services/baseApi';

export const challengeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableChallenges: builder.query({
      query: () => '/challenges',
      providesTags: ['Challenges'],
    }),

    joinChallenge: builder.mutation({
      query: (body) => ({ url: '/challenges/join', method: 'POST', body }),
      invalidatesTags: ['Challenges', 'MyChallenges'],
    }),

    getMyChallenges: builder.query({
      query: (status) =>
        status ? `/challenges/my-challenges?status=${status}` : '/challenges/my-challenges',
      providesTags: ['MyChallenges'],
    }),

    getUserChallengeDetail: builder.query({
      query: (id) => `/challenges/my-challenges/${id}`,
      providesTags: (result, error, id) => [{ type: 'MyChallenges', id }],
    }),

    getLeaderboard: builder.query({
      query: ({ challengeId, limit = 10 }) =>
        `/challenges/${challengeId}/leaderboard?limit=${limit}`,
    }),

    getMyProgress: builder.query({
      query: () => '/challenges/my-progress',
      providesTags: ['MyChallenges'],
    }),

    abandonChallenge: builder.mutation({
      query: (id) => ({ url: `/challenges/my-challenges/${id}`, method: 'DELETE' }),
      invalidatesTags: ['MyChallenges'],
    }),
  }),
});

export const {
  useGetAvailableChallengesQuery,
  useJoinChallengeMutation,
  useGetMyChallengesQuery,
  useGetUserChallengeDetailQuery,
  useGetLeaderboardQuery,
  useGetMyProgressQuery,
  useAbandonChallengeMutation,
} = challengeApi;
