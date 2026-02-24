import { baseApi } from '@shared/services/baseApi';

export const checklistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChecklist: builder.query({
      query: () => '/checklist',
      providesTags: ['Checklist'],
    }),
    getChecklistItem: builder.query({
      query: (itemType) => `/checklist/${itemType}`,
      providesTags: (result, error, itemType) => [{ type: 'Checklist', id: itemType }],
    }),
    updateChecklistItem: builder.mutation({
      query: ({ itemType, ...body }) => ({
        url: `/checklist/${itemType}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Checklist', 'Dashboard'],
    }),
  }),
});

export const {
  useGetChecklistQuery,
  useGetChecklistItemQuery,
  useUpdateChecklistItemMutation,
} = checklistApi;
