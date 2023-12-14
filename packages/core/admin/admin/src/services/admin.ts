import { prefixFileUrlWithBackendUrl } from '@strapi/helper-plugin';

import { adminApi } from './api';

import type {
  TelemetryProperties,
  Init,
  Information,
  GetProjectSettings,
  UpdateProjectSettings,
} from '../../../shared/contracts/admin';
import type { IsSSOLocked } from '../../../shared/contracts/providers';

interface ConfigurationLogo {
  custom?: {
    name?: string;
    url?: string;
  };
  default: string;
}

const admin = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    init: builder.query<Init.Response['data'], void>({
      query: () => ({
        url: '/admin/init',
        method: 'GET',
      }),
      transformResponse(res: Init.Response) {
        return res.data;
      },
    }),
    information: builder.query<Information.Response['data'], void>({
      query: () => ({
        url: '/admin/information',
        method: 'GET',
      }),
      transformResponse(res: Information.Response) {
        return res.data;
      },
    }),
    telemetryProperties: builder.query<TelemetryProperties.Response['data'], void>({
      query: () => ({
        url: '/admin/telemetry-properties',
        method: 'GET',
        config: {
          validateStatus: (status) => status < 500,
        },
      }),
      transformResponse(res: TelemetryProperties.Response) {
        return res.data;
      },
    }),
    projectSettings: builder.query<
      { authLogo?: ConfigurationLogo['custom']; menuLogo?: ConfigurationLogo['custom'] },
      void
    >({
      query: () => ({
        url: '/admin/project-settings',
        method: 'GET',
      }),
      providesTags: ['ProjectSettings'],
      transformResponse(data: GetProjectSettings.Response) {
        return {
          authLogo: data.authLogo
            ? {
                name: data.authLogo.name,
                url: prefixFileUrlWithBackendUrl(data.authLogo.url),
              }
            : undefined,
          menuLogo: data.menuLogo
            ? {
                name: data.menuLogo.name,
                url: prefixFileUrlWithBackendUrl(data.menuLogo.url),
              }
            : undefined,
        };
      },
    }),
    updateProjectSettings: builder.mutation<UpdateProjectSettings.Response, FormData>({
      query: (data) => ({
        url: '/admin/project-settings',
        method: 'POST',
        data,
        config: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      }),
      invalidatesTags: ['ProjectSettings'],
    }),
    isSSOLocked: builder.query<IsSSOLocked.Response['data'], void>({
      query: () => ({
        url: '/admin/providers/isSSOLocked',
        method: 'GET',
      }),
      transformResponse(res: IsSSOLocked.Response) {
        return res.data;
      },
    }),
  }),
  overrideExisting: false,
});

const {
  useInitQuery,
  useTelemetryPropertiesQuery,
  useInformationQuery,
  useProjectSettingsQuery,
  useUpdateProjectSettingsMutation,
  useIsSSOLockedQuery,
} = admin;

export {
  useInitQuery,
  useTelemetryPropertiesQuery,
  useInformationQuery,
  useProjectSettingsQuery,
  useUpdateProjectSettingsMutation,
  useIsSSOLockedQuery,
};

export type { ConfigurationLogo };
