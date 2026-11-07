import type { Cafeteria } from '../model';

export type CafeteriaIssue = { path: string; message: string };

const isBlank = (value: string | null | undefined) => !value || value.trim() === '';

/**
 * 유효성 검사: 메뉴 0개 + extra는 apis가 extra를 메뉴 행에 저장해서 보존 불가라 에러로 막음
 */
export const validateCafeteria = (cafeteria: Cafeteria): CafeteriaIssue[] => {
  const issues: CafeteriaIssue[] = [];
  const corners = new Set<string | null>();

  cafeteria.menus.forEach((menu, cornerIndex) => {
    const cornerPath = `menus.${cornerIndex}`;
    const corner = menu.corner ?? null;

    if (corner !== null && corner.trim() === '') {
      issues.push({ path: `${cornerPath}.corner`, message: '코너명이 비어 있어요. 코너가 없으면 null로 둬요.' });
    }
    if (corner === 'DEFAULT') {
      issues.push({ path: `${cornerPath}.corner`, message: 'DEFAULT는 서버 예약어라 코너명으로 쓸 수 없어요.' });
    }
    if (corners.has(corner)) {
      issues.push({ path: `${cornerPath}.corner`, message: `같은 코너가 두 번 있어요: ${corner ?? '(코너 없음)'}` });
    }
    corners.add(corner);

    const names = new Set<string>();
    menu.items.forEach((item, itemIndex) => {
      const itemPath = `${cornerPath}.items.${itemIndex}`;

      if (item.role !== 'MAIN' && item.role !== 'SUB') {
        issues.push({ path: `${itemPath}.role`, message: 'role은 MAIN 또는 SUB여야 해요.' });
      }
      if (isBlank(item.name)) {
        issues.push({ path: `${itemPath}.name`, message: '메뉴명이 비어 있어요.' });
      } else if (names.has(item.name!.trim())) {
        issues.push({ path: `${itemPath}.name`, message: `같은 코너에 같은 메뉴가 있어요: ${item.name}` });
      } else {
        names.add(item.name!.trim());
      }
      if (item.price != null && (!Number.isInteger(item.price) || item.price < 0)) {
        issues.push({ path: `${itemPath}.price`, message: '가격은 0 이상 정수여야 해요.' });
      }
      (item.side ?? []).forEach((side, sideIndex) => {
        if (isBlank(side)) issues.push({ path: `${itemPath}.side.${sideIndex}`, message: '빈 사이드가 있어요.' });
      });
    });
  });

  (cafeteria.extra ?? []).forEach((extra, extraIndex) => {
    if (isBlank(extra)) issues.push({ path: `extra.${extraIndex}`, message: '빈 extra가 있어요.' });
  });

  const hasItems = cafeteria.menus.some((menu) => menu.items.length > 0);
  if (!hasItems && (cafeteria.extra ?? []).length > 0) {
    issues.push({ path: 'extra', message: '메뉴가 하나도 없으면 extra를 저장할 수 없어요.' });
  }

  return issues;
};
