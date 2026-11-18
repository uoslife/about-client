export type CafeteriaOrigin = { code: string; targetUrl: string };

const placeUrl = (rstcde: string) =>
  `https://www.uos.ac.kr/food/placeList.do?rstcde=${rstcde}&identified=anonymous&mode=week`;

export const CAFETERIA_ORIGINS: Record<string, CafeteriaOrigin> = {
  '1e207d14-d2ea-4275-8f41-7230cf7a1aa3': { code: 'uos.cafeteria.irum', targetUrl: placeUrl('010') },
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': { code: 'uos.cafeteria.student', targetUrl: placeUrl('020') },
  'f262ad60-0ed7-4591-b411-1a96ceefd30e': { code: 'uos.cafeteria.finedining', targetUrl: placeUrl('030') },
  'f69af299-de24-4bed-a6f0-77c5e12982cc': { code: 'uos.cafeteria.jagwagwan', targetUrl: placeUrl('040') },
};

export const getCafeteriaOrigin = (cafeteriaId: string, cafeteriaName: string): CafeteriaOrigin => {
  const origin = CAFETERIA_ORIGINS[cafeteriaId];
  if (!origin) throw new Error(`${cafeteriaName}의 origin 상수가 없습니다. lib/origin.ts에 추가해야 합니다.`);
  return origin;
};
