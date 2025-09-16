import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import type { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';

async function refreshAccessToken(token: { refreshToken: string }) {
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.KEYCLOAK_ISSUER;

  if (!clientId || !clientSecret || !issuer) {
    throw new Error('Missing Keycloak configuration');
  }

  try {
    const url = `${issuer}/protocol/openid-connect/token`;

    const body = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: token.refreshToken as string,
    };

    const urlencoded = new URLSearchParams(body);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: urlencoded,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    throw {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

type SessionType = {
  accessToken: string;
  refreshToken: string;
} & Session;

const DEFAULT_TIMEOUT_MS = 10 * 1000;

const MAX_RETRY_COUNT = 3;

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

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount > MAX_RETRY_COUNT) {
        return Promise.reject(error);
      }

      try {
        const session = (await getSession()) as SessionType;

        const token = await refreshAccessToken({
          refreshToken: session?.refreshToken as string,
        });
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token.accessToken}`,
        };
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        signOut({ callbackUrl: '/' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

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
