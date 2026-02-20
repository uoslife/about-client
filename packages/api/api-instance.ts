import Axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
} from 'axios';
import { getAccessToken } from './src/authToken';

const DEFAULT_TIMEOUT_MS = 10 * 1000;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://about-api.uoslife.com',
  timeout: DEFAULT_TIMEOUT_MS,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
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
