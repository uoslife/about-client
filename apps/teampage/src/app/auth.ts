import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { getAccessTokenByRefreshToken, isTokenExpired } from '@/shared/utils/jwt';

/**
 * 로컬 개발 전용 목로그인. 실 Keycloak 서버 없이 next-auth 세션을 즉시 발급한다.
 * NEXT_PUBLIC_ENABLE_MOCK=true 일 때만 provider 목록에 추가되며, `/api/auth/signin`
 * 페이지에서 "목업 로그인(개발용)" 버튼으로 노출된다.
 */
const mockCredentialsProvider = CredentialsProvider({
  id: 'mock',
  name: '목업 로그인 (개발용)',
  credentials: {},
  async authorize() {
    return {
      id: 'mock-user-0001',
      name: '목업',
      email: 'mock@uoslife.team',
    };
  },
});

const getAuthOptions = (): NextAuthOptions => {
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.KEYCLOAK_ISSUER;
  const isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true';

  if (!clientId || !clientSecret || !issuer) {
    throw new Error('Missing Keycloak configuration');
  }

  return {
    providers: [
      KeycloakProvider({
        clientId,
        clientSecret,
        issuer,
      }),
      ...(isMockEnabled ? [mockCredentialsProvider] : []),
    ],
    session: {
      strategy: 'jwt' as const,
    },
    callbacks: {
      // https://authjs.dev/guides/refresh-token-rotation#jwt-strategy
      async jwt({ token: _token, account }) {
        const token = _token as JWT & {
          accessToken?: string;
          refreshToken?: string;
        };

        // 첫 로그인하는 경우
        if (account) {
          const newToken = {
            ...token,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            idToken: account.id_token,
          };
          return newToken;
        }

        if (!token.accessToken || !token.refreshToken) return token;

        const isExpired = isTokenExpired(token.accessToken);

        // access token이 만료되지 않은 경우
        if (!isExpired) return token;

        // access token이 만료된 경우
        try {
          const newTokens = await getAccessTokenByRefreshToken(token.refreshToken);
          token.accessToken = newTokens.accessToken;
          token.refreshToken = newTokens.refreshToken;

          return token;
        } catch (error) {
          console.error('Error refreshing access token:', error);
          throw new Error('Failed to refresh access token');
        }
      },
      async session({ session, token }) {
        return {
          ...session,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          idToken: token.idToken,
        };
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};

export const authOptions: NextAuthOptions = getAuthOptions();
