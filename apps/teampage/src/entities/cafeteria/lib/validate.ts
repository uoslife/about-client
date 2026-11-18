import type { Cafeteria } from '../model';

/** `path`는 `menus.{코너}.items.{메뉴}.{필드}` 형식. 화면이 이 경로로 칸을 찾아 에러를 붙인다. */
type CafeteriaIssue = { path: string; message: string };

const isBlank = (value: string | null | undefined) => !value || value.trim() === '';

export const validateCafeteria = (cafeteria: Cafeteria): CafeteriaIssue[] => {
  const issues: CafeteriaIssue[] = [];
  const corners = new Set<string | null>();

  cafeteria.menus.forEach((menu, cornerIndex) => {
    const cornerPath = `menus.${cornerIndex}`;
    const corner = menu.corner ?? null;

    if (corner !== null && corner.trim() === '') {
      issues.push({ path: `${cornerPath}.corner`, message: '코너를 골라 주세요' });
    }
    if (corner === 'DEFAULT') {
      issues.push({ path: `${cornerPath}.corner`, message: 'DEFAULT는 코너명으로 쓸 수 없어요' });
    }
    if (corners.has(corner)) {
      issues.push({ path: `${cornerPath}.corner`, message: '이미 있는 코너예요' });
    }
    corners.add(corner);

    const names = new Set<string>();
    menu.items.forEach((item, itemIndex) => {
      const itemPath = `${cornerPath}.items.${itemIndex}`;

      if (item.role !== 'MAIN' && item.role !== 'SUB') {
        issues.push({ path: `${itemPath}.role`, message: 'MAIN 또는 SUB여야 해요' });
      }
      if (isBlank(item.name)) {
        issues.push({ path: `${itemPath}.name`, message: '메뉴명을 입력해 주세요' });
      } else if (names.has(item.name!.trim())) {
        issues.push({ path: `${itemPath}.name`, message: '같은 코너에 같은 메뉴가 있어요' });
      } else {
        names.add(item.name!.trim());
      }

      // apis는 MAIN 가격이 비면 기본가를 채워 주지만, 편집기는 기대지 않고 모든 메뉴에 가격을 직접 받는다.
      const price = item.price;
      if (price != null && (!Number.isInteger(price) || price < 0)) {
        issues.push({ path: `${itemPath}.price`, message: '숫자만 입력해 주세요' });
      } else if (price == null || price === 0) {
        issues.push({ path: `${itemPath}.price`, message: '가격을 입력해 주세요' });
      }

      (item.side ?? []).forEach((side, sideIndex) => {
        if (isBlank(side)) issues.push({ path: `${itemPath}.side.${sideIndex}`, message: '사이드를 입력해 주세요' });
      });
    });
  });

  (cafeteria.extra ?? []).forEach((extra, extraIndex) => {
    if (isBlank(extra)) issues.push({ path: `extra.${extraIndex}`, message: '공지를 입력해 주세요' });
  });

  const hasItems = cafeteria.menus.some((menu) => menu.items.length > 0);
  if (!hasItems && (cafeteria.extra ?? []).length > 0) {
    issues.push({ path: 'extra', message: '메뉴가 없으면 공지를 저장할 수 없어요' });
  }

  return issues;
};
