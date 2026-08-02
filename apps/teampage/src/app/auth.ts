import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { getAccessTokenByRefreshToken, isTokenExpired } from '@/shared/utils/jwt';

const getAuthOptions = (): NextAuthOptions => {
  // 로컬 프로토타이핑(MOCK_AUTH=true)에서는 실제 Keycloak 없이도 NextAuth가 초기화되도록
  // 더미 값을 채운다. 실제 로그인 플로우는 타지 않고, 세션은 mock 세션으로 대체된다.
  const isMockAuth = process.env.MOCK_AUTH === 'true';
  const clientId = process.env.KEYCLOAK_CLIENT_ID ?? (isMockAuth ? 'mock-client-id' : undefined);
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? (isMockAuth ? 'mock-client-secret' : undefined);
  const issuer = process.env.KEYCLOAK_ISSUER ?? (isMockAuth ? 'http://localhost:9999/mock-realm' : undefined);

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
    secret: process.env.NEXTAUTH_SECRET ?? (isMockAuth ? 'mock-nextauth-secret-do-not-use-in-prod' : undefined),
  };
};

export const authOptions: NextAuthOptions = getAuthOptions();
