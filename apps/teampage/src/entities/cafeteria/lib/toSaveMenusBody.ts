import type { Cafeteria, Corner, MealTime, SaveMenusBody } from '../model';
import type { CafeteriaOrigin } from './origin';

type Params = {
  date: string;
  mealTime: MealTime;
  origin: CafeteriaOrigin;
  /** 저장 직전에 다시 조회한 서버 값. 편집을 시작할 때 불러온 값을 넣으면 그사이 생긴 코너를 못 지운다. */
  prev: Cafeteria;
  /** 편집이 끝난 값. `validateCafeteria`를 통과한 상태여야 한다. */
  next: Cafeteria;
};

/**
 * 편집한 식당 하나(GET 응답 모양)를 apis `POST /cafeterias` body로 바꾼다.
 *
 * 이 API는 이름만 웹훅이고, 스크래퍼가 쓰는 일반 저장 API다. 동작이 직관적이지 않아서
 * 아래 규칙을 알아야 이 함수가 이해된다(apis `CafeteriaMenuService.saveMenus`).
 *
 * 1. 덮어쓰기 단위가 코너다.
 *    body의 `menus[]` 원소 하나 = (식당, 날짜, 끼, 코너) 하나. 서버는 그 코너의 기존 메뉴를
 *    전부 지우고 `items`를 새로 넣는다. 메뉴 하나만 고치는 API는 없다.
 * 2. body에 없는 코너는 건드리지 않는다.
 *    그래서 편집에서 지운 코너를 body에서 빼면 DB에 그대로 남는다. 지우려면 그 코너를
 *    `items: []`로 명시해서 보내야 한다. → `removed`
 * 3. extra(고급식 안내 등)는 코너마다 따로 저장된다.
 *    GET은 식당 단위로 합쳐서 내려주지만, 저장은 코너별 `content.extra`로 받는다. 코너마다
 *    다르게 보내면 앱에서 섞여 보이므로 식당 단위 값을 모든 코너에 똑같이 복사한다.
 *    메뉴가 0개인 코너는 저장되는 행이 없어서 extra도 남지 않는다.
 * 4. 코너가 없는 식당은 `corner: null`. 서버가 `"DEFAULT"`로 저장하고 GET에서 다시 null로 준다.
 * 5. `price: null`이면 서버가 MAIN에만 (식당, 코너)별 기본가를 채운다. SUB는 null로 남는다.
 * 6. `isPopular`는 서버가 조회할 때 계산하는 값이라 보내지 않는다.
 * 7. `origin`으로 식당 정보(code, name, target_url)를 덮어쓴다. name은 GET 값을, 나머지는
 *    `lib/origin.ts` 상수를 쓴다.
 *
 * 결과적으로 식당 하나의 한 끼를 통째로 맞추는 요청 1건이 되고, 서버에서 트랜잭션 1개로
 * 처리돼 일부만 반영되는 일은 없다.
 */
export const toSaveMenusBody = ({ date, mealTime, origin, prev, next }: Params): SaveMenusBody => {
  const extra = next.extra ?? [];
  // 코너 없음(null)도 코너 하나로 친다.
  const nextCorners = new Set(next.menus.map((menu) => menu.corner ?? null));
  const removed = prev.menus.filter((menu) => !nextCorners.has(menu.corner ?? null));

  const toMenu = (corner: Corner['corner'], items: Corner['items']) => ({
    meal_date: date,
    meal_time: mealTime,
    corner: corner ?? null,
    content: {
      items: items.map(({ role, name, side, price }) => ({
        role: role ?? null,
        name: name ?? null,
        side: side ?? [],
        price: price ?? null,
      })),
      extra,
    },
  });

  return {
    cafeteria_menus: {
      origin: { id: next.id, code: origin.code, name: next.name, target_url: origin.targetUrl },
      menus: [
        ...next.menus.map((menu) => toMenu(menu.corner, menu.items)),
        ...removed.map((menu) => toMenu(menu.corner, [])),
      ],
    },
  };
};
