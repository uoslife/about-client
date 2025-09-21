import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

type SessionType = {
  accessToken: string;
  refreshToken: string;
} & Session;

const DEFAULT_TIMEOUT_MS = 10 * 1000;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'https://apis.uoslife.team',
  timeout: DEFAULT_TIMEOUT_MS,
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const session = (await getSession()) as SessionType;
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const apiInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
