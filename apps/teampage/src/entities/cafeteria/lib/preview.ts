import type { Cafeteria, MenuItem } from '../model';

/** Kotlin String.compareTo와 같은 UTF-16 코드 단위 비교. localeCompare는 한글 순서가 달라질 수 있다. */
export const compareCodeUnits = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** apis가 코너를 정렬할 때 쓰는 키: 코너명의 첫 영문 덩어리. 코너 없음은 DB에 "DEFAULT"로 들어간다. */
const cornerSortKey = (corner: string | null | undefined) => {
  const stored = corner ?? 'DEFAULT';
  return stored.match(/[A-Za-z]+/)?.[0] ?? stored;
};

const roleRank = (item: MenuItem) => (item.role === 'MAIN' ? 0 : 1);

export const previewSaved = (next: Cafeteria): Cafeteria => {
  const menus = next.menus
    .filter((menu) => menu.items.length > 0)
    .map((menu) => ({
      corner: menu.corner ?? null,
      items: menu.items
        .map((item) => ({
          role: item.role ?? '',
          name: item.name ?? '',
          side: item.side ?? [],
          price: item.price ?? null,
          isPopular: false,
        }))
        .sort((a, b) => roleRank(a) - roleRank(b) || compareCodeUnits(a.name, b.name)),
    }))
    .sort((a, b) => compareCodeUnits(cornerSortKey(a.corner), cornerSortKey(b.corner)));

  return {
    ...next,
    menus,
    extra: menus.length > 0 ? Array.from(new Set(next.extra ?? [])) : [],
  };
};
