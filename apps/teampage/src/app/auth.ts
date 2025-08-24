import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const getAuthOptions = () => {
  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.KEYCLOAK_ISSUER;

  if (!clientId || !clientSecret || !issuer) {
    throw new Error("Missing Keycloak configuration");
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
      strategy: "jwt" as const,
    },
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
        }
        return token;
      },
      async session({ session, token }) {
        return {
          ...session,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };
      },
    },
  };
};

export const authOptions: NextAuthOptions = getAuthOptions();
