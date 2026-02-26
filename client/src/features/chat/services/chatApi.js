import { baseApi } from '@shared/services/baseApi';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query({
      query: (limit = 50) => `/chat/history?limit=${limit}`,
      providesTags: ['Chat'],
    }),

    sendMessage: builder.mutation({
      query: (content) => ({
        url: '/chat/send',
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Chat'],
    }),

    clearHistory: builder.mutation({
      query: () => ({ url: '/chat/history', method: 'DELETE' }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useClearHistoryMutation,
} = chatApi;
