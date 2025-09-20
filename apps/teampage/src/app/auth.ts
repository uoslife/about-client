import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';
import {
  getAccessTokenByRefreshToken,
  isTokenExpired,
} from '@/shared/utils/jwt';

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
      async jwt({ token: _token }) {
        const token = _token as JWT & {
          accessToken: string;
          refreshToken: string;
        };
        const isExpired = isTokenExpired(token.accessToken);

        if (!isExpired) return token;

        try {
          const newTokens = await getAccessTokenByRefreshToken(
            token.refreshToken,
          );
          token.accessToken = newTokens.accessToken;
          token.accessToken = newTokens.refreshToken;

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
        };
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
};

export const authOptions: NextAuthOptions = getAuthOptions();
