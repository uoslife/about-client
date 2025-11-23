import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { getAccessTokenByRefreshToken, isTokenExpired } from '@/shared/utils/jwt';

const getAuthOptions = (): NextAuthOptions => {
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.KEYCLOAK_ISSUER;

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
    secret: process.env.NEXTAUTH_SECRET,
  };
};

export const authOptions: NextAuthOptions = getAuthOptions();
