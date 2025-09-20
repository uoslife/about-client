import { type JwtPayload, jwtDecode } from 'jwt-decode';

const getTokenExpiration = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp) {
      return decoded.exp;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
};

export const getAccessTokenByRefreshToken = async (refreshToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET;
  const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;

  if (!clientId || !clientSecret || !issuer) {
    throw new Error('Missing Keycloak configuration');
  }

  try {
    const url = `${issuer}/protocol/openid-connect/token`;

    const body = {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken as string,
    };

    const urlencoded = new URLSearchParams(body);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: urlencoded,
    });

    const resTokens = await response.json();

    if (!response.ok) throw resTokens;

    return {
      accessToken: resTokens.access_token,
      accessTokenExpires: Date.now() + resTokens.expires_in * 1000,
      refreshToken: resTokens.refresh_token ?? refreshToken,
    };
  } catch (error) {
    console.error(error);
    throw {
      refreshToken,
      error: 'RefreshAccessTokenError',
    };
  }
};
