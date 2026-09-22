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
  // 이 파일은 app/auth.ts(서버)에서만 import 된다. NEXT_PUBLIC_ 접두사가 붙어
  // 있었는데, 그 접두사는 "브라우저에 노출해도 되는 값"이라는 선언이라 시크릿에
  // 붙으면 안 된다. 게다가 NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET 은 어디에서도
  // 공급되지 않아 이 함수가 항상 throw 하고 있었다.
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
