import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery, type UnknownApiError } from '../utils/baseQuery';

const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Me', 'User', 'ProjectSettings'],
  endpoints: () => ({}),
});

export { adminApi, type UnknownApiError };
