import { compareCodeUnits, getCornerOptions, type Cafeteria, type Corner, type MenuItem } from '@/entities/cafeteria';

export type Role = 'MAIN' | 'SUB';

/** 사이드 한 줄, 공지 한 줄. `source`는 처음 불러온 값이라 바뀐 칸 표시(success)에 쓴다. 새 줄은 null. */
export type Line = { key: string; value: string; source: string | null };

export type FormMenu = {
  key: string;
  /** Before에서 온 메뉴면 원본. 손대지 않은 필드는 원본 값을 그대로 돌려줘서 null/빈 배열 모양까지 지킨다. */
  source: MenuItem | null;
  /** 원본 코너 안 순번. 순서를 안 바꿨으면 섹션으로 나누기 전 순서로 되돌리는 데 쓴다. */
  sourceIndex: number | null;
  name: string;
  /** input 값 그대로. '' = 가격 없음 */
  price: string;
  sides: Line[];
  /** 지웠지만 "○○ 삭제 예정"으로 남겨 되돌릴 수 있게. Before에 있던 메뉴만 이렇게 남는다. */
  removed: boolean;
};

export type FormCorner = {
  key: string;
  source: Corner | null;
  corner: string | null;
  main: FormMenu[];
  sub: FormMenu[];
};

export type FormValues = {
  /** 편집을 시작한 시점의 서버 값. dirty 판정과 저장의 loaded 인자에 쓴다(캐시가 바뀌어도 그대로). */
  loaded: Cafeteria;
  corners: FormCorner[];
  extra: Line[];
};

let sequence = 0;
const newKey = (prefix: string) => `${prefix}${++sequence}`;

const priceText = (price: number | null | undefined) => (price == null ? '' : String(price));

const emptyLine = (): Line => ({ key: newKey('l'), value: '', source: null });
const updateLine = (lines: Line[], lineKey: string, value: string) =>
  lines.map((line) => (line.key === lineKey ? { ...line, value } : line));
const removeLine = (lines: Line[], lineKey: string) => lines.filter((line) => line.key !== lineKey);
/** 줄을 위(-1)·아래(+1)로 한 칸 옮긴다. 끝에서 더 못 가면 그대로. */
export const moveLine = (lines: Line[], lineKey: string, offset: -1 | 1) => {
  const from = lines.findIndex((line) => line.key === lineKey);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= lines.length) return lines;
  const next = [...lines];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};

const toLines = (values: string[] | null | undefined): Line[] =>
  (values ?? []).map((value) => ({ key: newKey('l'), value, source: value }));

const toFormMenu = (item: MenuItem, sourceIndex: number): FormMenu => ({
  key: newKey('i'),
  source: item,
  sourceIndex,
  name: item.name ?? '',
  price: priceText(item.price),
  sides: toLines(item.side),
  removed: false,
});

const emptyCorner = (corner: string | null): FormCorner => ({
  key: newKey('c'),
  source: null,
  corner,
  main: [],
  sub: [],
});

export const toFormValues = (loaded: Cafeteria): FormValues => {
  const corners = loaded.menus.map<FormCorner>((menu) => ({
    key: newKey('c'),
    source: menu,
    corner: menu.corner ?? null,
    main: menu.items.flatMap((item, index) => (item.role !== 'SUB' ? [toFormMenu(item, index)] : [])),
    sub: menu.items.flatMap((item, index) => (item.role === 'SUB' ? [toFormMenu(item, index)] : [])),
  }));
  if (corners.length === 0 && getCornerOptions(loaded.name).length === 0) corners.push(emptyCorner(null));
  return { loaded, corners, extra: toLines(loaded.extra) };
};

const parsePrice = (price: string) => {
  const trimmed = price.replace(/,/g, '').trim();
  return trimmed === '' ? null : Number(trimmed);
};

const sameValues = (a: string[], b: string[]) => a.length === b.length && a.every((value, index) => value === b[index]);

const toMenuItem = (item: FormMenu, role: Role): MenuItem => {
  const sides = item.sides.map((line) => line.value);
  const price = parsePrice(item.price);
  const source = item.source;
  if (!source) return { role, name: item.name, side: sides, price, isPopular: false };
  return {
    ...source,
    role: (source.role === 'SUB') === (role === 'SUB') ? source.role : role,
    name: item.name === (source.name ?? '') ? source.name : item.name,
    side: sameValues(sides, source.side ?? []) ? source.side : sides,
    price: item.price === priceText(source.price) ? source.price : price,
  };
};

/** 코너의 메뉴 구성이 원본과 같은지(추가·삭제 없음). 새 메뉴는 섹션 끝에만 붙으니 이것만 보면 된다. */
const keepsSourceOrder = (corner: FormCorner) =>
  [...corner.main, ...corner.sub].every((item) => item.source !== null && !item.removed);

/** 검증 경로(`menus.0.items.1.price`) → 수정 폼 칸 key. 지운 메뉴·빈 코너가 빠져 순번이 달라지니 같이 만든다. */
type FieldPaths = Map<string, string>;

/**
 * 수정 폼 값을 저장할 식당 값(GET 응답 모양)으로 되돌리고, 검증 경로 → 폼 칸 key 표를 같이 만든다.
 * 손대지 않은 부분은 원본 값을 그대로 돌려줘서 dirty 판정과 저장 body가 원본과 어긋나지 않게 한다.
 */
export const toCafeteria = (form: FormValues): { cafeteria: Cafeteria; paths: FieldPaths } => {
  const paths: FieldPaths = new Map();
  const menus: Corner[] = [];

  form.corners.forEach((corner) => {
    const kept = [
      ...corner.main.filter((item) => !item.removed).map((item) => ({ item, role: 'MAIN' as const })),
      ...corner.sub.filter((item) => !item.removed).map((item) => ({ item, role: 'SUB' as const })),
    ];
    if (kept.length === 0) return;
    // 메뉴를 더하거나 빼지 않았으면 원본 순서 그대로(빈 role처럼 MAIN·SUB 밖의 값이 섞여 있어도 왕복이 같게).
    if (corner.source && keepsSourceOrder(corner)) {
      kept.sort((a, b) => (a.item.sourceIndex ?? 0) - (b.item.sourceIndex ?? 0));
    }

    const cornerIndex = menus.length;
    paths.set(`menus.${cornerIndex}.corner`, corner.key);
    kept.forEach(({ item }, itemIndex) => {
      const base = `menus.${cornerIndex}.items.${itemIndex}`;
      paths.set(`${base}.name`, `${item.key}.name`);
      paths.set(`${base}.price`, `${item.key}.price`);
      paths.set(`${base}.role`, `${item.key}.name`);
      item.sides.forEach((line, sideIndex) => paths.set(`${base}.side.${sideIndex}`, line.key));
    });

    const source = corner.source;
    menus.push({
      ...(source ?? {}),
      corner: source && (source.corner ?? null) === corner.corner ? source.corner : corner.corner,
      items: kept.map(({ item, role }) => toMenuItem(item, role)),
    });
  });

  const loadedExtra = form.loaded.extra;
  // 공지 줄을 그대로 두면 원본 그대로(원본에 빈 줄이 있어도). 고쳤으면 빈 줄은 뺀다("반영 시 제외").
  const untouchedExtra = sameValues(
    form.extra.map((line) => line.value),
    loadedExtra ?? [],
  );
  const extraLines = untouchedExtra ? form.extra : form.extra.filter((line) => line.value.trim() !== '');
  extraLines.forEach((line, index) => paths.set(`extra.${index}`, line.key));
  const extraValues = extraLines.map((line) => line.value);
  // 빈 줄만 더한 경우처럼 정리한 결과가 원본과 같으면 원본 모양(null 포함)을 지킨다.
  const extra = sameValues(extraValues, loadedExtra ?? []) ? loadedExtra : extraValues;

  return { cafeteria: { ...form.loaded, menus, extra }, paths };
};

/** 바뀐 칸인지(TextField success). 새로 넣은 칸은 모두 바뀐 칸이다. */
export const isNameChanged = (item: FormMenu) => !item.source || item.name !== (item.source.name ?? '');
export const isPriceChanged = (item: FormMenu) => !item.source || item.price !== priceText(item.source.price);
export const isLineChanged = (line: Line) => line.value !== line.source;

export type FormAction =
  | { type: 'reset' }
  | { type: 'setCorner'; cornerKey: string; corner: string }
  | { type: 'addCorner'; corner: string }
  | { type: 'removeCornerItems'; cornerKey: string }
  | { type: 'addItem'; cornerKey: string; role: Role }
  | { type: 'updateItem'; itemKey: string; name?: string; price?: string }
  | { type: 'removeItem'; itemKey: string }
  | { type: 'restoreItem'; itemKey: string }
  | { type: 'sortSection'; itemKey: string }
  | { type: 'addSide'; itemKey: string }
  | { type: 'updateSide'; itemKey: string; lineKey: string; value: string }
  | { type: 'removeSide'; itemKey: string; lineKey: string }
  | { type: 'moveSide'; itemKey: string; lineKey: string; offset: -1 | 1 }
  | { type: 'addExtra' }
  | { type: 'updateExtra'; lineKey: string; value: string }
  | { type: 'removeExtra'; lineKey: string };

export const sectionOf = (role: Role) => (role === 'MAIN' ? 'main' : 'sub');

const mapCorner = (form: FormValues, cornerKey: string, fn: (corner: FormCorner) => FormCorner): FormValues => ({
  ...form,
  corners: form.corners.map((corner) => (corner.key === cornerKey ? fn(corner) : corner)),
});

/** 메뉴를 고치거나 없앤다. fn이 null을 돌려주면 목록에서 뺀다. */
const mapItem = (form: FormValues, itemKey: string, fn: (item: FormMenu) => FormMenu | null): FormValues => {
  const apply = (items: FormMenu[]) =>
    items.flatMap((item) => {
      if (item.key !== itemKey) return [item];
      const next = fn(item);
      return next ? [next] : [];
    });
  return {
    ...form,
    corners: form.corners.map((corner) => ({ ...corner, main: apply(corner.main), sub: apply(corner.sub) })),
  };
};

/** 섹션 안 메뉴를 apis가 저장 후 돌려주는 순서(메뉴명 오름차순)로 정렬한다. 이름이 빈 메뉴는 끝에 둔다. 같은 이름은 지금 순서를 지킨다. */
const sortByName = (items: FormMenu[]) =>
  [...items].sort((a, b) => {
    if (!a.name.trim() || !b.name.trim()) return Number(!a.name.trim()) - Number(!b.name.trim());
    return compareCodeUnits(a.name, b.name);
  });

/** 새로 넣은 메뉴는 지우면 바로 사라지고, Before에 있던 메뉴는 "삭제 예정"으로 남는다. */
const removeOrMark = (item: FormMenu): FormMenu | null => (item.source ? { ...item, removed: true } : null);

/** 수정 폼 값의 reducer. 메뉴는 key로 찾고, Before에 있던 메뉴는 지워도 "삭제 예정"으로 남긴다. */
export const formReducer = (form: FormValues, action: FormAction): FormValues => {
  switch (action.type) {
    case 'reset':
      return toFormValues(form.loaded);
    case 'setCorner':
      return mapCorner(form, action.cornerKey, (corner) => ({ ...corner, corner: action.corner }));
    case 'addCorner':
      return { ...form, corners: [...form.corners, emptyCorner(action.corner)] };
    case 'removeCornerItems':
      return mapCorner(form, action.cornerKey, (corner) => ({
        ...corner,
        main: corner.main.flatMap((item) => removeOrMark(item) ?? []),
        sub: corner.sub.flatMap((item) => removeOrMark(item) ?? []),
      }));
    case 'addItem': {
      const item: FormMenu = {
        key: newKey('i'),
        source: null,
        sourceIndex: null,
        name: '',
        price: '',
        sides: [],
        removed: false,
      };
      const section = sectionOf(action.role);
      return mapCorner(form, action.cornerKey, (corner) => ({ ...corner, [section]: [...corner[section], item] }));
    }
    case 'updateItem':
      return mapItem(form, action.itemKey, (item) => ({
        ...item,
        name: action.name ?? item.name,
        price: action.price ?? item.price,
      }));
    case 'removeItem':
      return mapItem(form, action.itemKey, removeOrMark);
    case 'sortSection':
      return {
        ...form,
        corners: form.corners.map((corner) => {
          const has = (items: FormMenu[]) => items.some((item) => item.key === action.itemKey);
          if (has(corner.main)) return { ...corner, main: sortByName(corner.main) };
          if (has(corner.sub)) return { ...corner, sub: sortByName(corner.sub) };
          return corner;
        }),
      };
    case 'restoreItem':
      return mapItem(form, action.itemKey, (item) => ({ ...item, removed: false }));
    case 'addSide':
      return mapItem(form, action.itemKey, (item) => ({
        ...item,
        sides: [...item.sides, emptyLine()],
      }));
    case 'updateSide':
      return mapItem(form, action.itemKey, (item) => ({
        ...item,
        sides: updateLine(item.sides, action.lineKey, action.value),
      }));
    case 'removeSide':
      return mapItem(form, action.itemKey, (item) => ({
        ...item,
        sides: removeLine(item.sides, action.lineKey),
      }));
    case 'moveSide':
      return mapItem(form, action.itemKey, (item) => ({
        ...item,
        sides: moveLine(item.sides, action.lineKey, action.offset),
      }));
    case 'addExtra':
      return { ...form, extra: [...form.extra, emptyLine()] };
    case 'updateExtra':
      return { ...form, extra: updateLine(form.extra, action.lineKey, action.value) };
    case 'removeExtra':
      return { ...form, extra: removeLine(form.extra, action.lineKey) };
  }
};
