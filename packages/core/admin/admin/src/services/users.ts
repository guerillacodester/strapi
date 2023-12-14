import { FindRole, FindRoles } from '../../../shared/contracts/roles';
import * as Users from '../../../shared/contracts/user';

import { adminApi } from './api';

const usersService = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * users
     */
    updateUser: builder.mutation<
      Users.Update.Response['data'],
      Omit<Users.Update.Request['body'] & Users.Update.Params, 'blocked'>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'User', id }],
    }),
    getUsers: builder.query<
      {
        users: Users.FindAll.Response['data']['results'];
        pagination: Users.FindAll.Response['data']['pagination'] | null;
      },
      GetUsersParams | void
    >({
      query: ({ id, ...params } = {}) => ({
        url: `/admin/users/${id ?? ''}`,
        method: 'GET',
        config: {
          params,
        },
      }),
      transformResponse: (res: Users.FindAll.Response | Users.FindOne.Response) => {
        let users: Users.FindAll.Response['data']['results'] = [];

        if (res.data) {
          if ('results' in res.data) {
            if (Array.isArray(res.data.results)) {
              users = res.data.results;
            }
          } else {
            users = [res.data];
          }
        }

        return {
          users,
          pagination: 'pagination' in res.data ? res.data.pagination : null,
        };
      },
    }),
    /**
     * roles
     */
    getRoles: builder.query<FindRoles.Response['data'], GetRolesParams | void>({
      query: ({ id, ...params } = {}) => ({
        url: `/admin/roles/${id ?? ''}`,
        method: 'GET',
        config: {
          params,
        },
      }),
      transformResponse: (res: FindRole.Response | FindRoles.Response) => {
        let roles: FindRoles.Response['data'] = [];

        if (res.data) {
          if (Array.isArray(res.data)) {
            roles = res.data;
          } else {
            roles = [res.data];
          }
        }

        return roles;
      },
    }),
  }),
  overrideExisting: false,
});

type GetUsersParams = Users.FindOne.Params | (Users.FindAll.Request['query'] & { id?: never });
type GetRolesParams = FindRole.Request['params'] | (FindRoles.Request['query'] & { id?: never });

const { useUpdateUserMutation, useGetRolesQuery, useGetUsersQuery } = usersService;

const useAdminUsers = useGetUsersQuery;

export { useUpdateUserMutation, useGetRolesQuery, useAdminUsers };
export type { GetRolesParams, GetUsersParams };
