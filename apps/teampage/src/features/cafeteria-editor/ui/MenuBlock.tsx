'use client';
import { IconButton, TextField } from '@/shared/component/ds';
import { isNameChanged, isPriceChanged, type FormMenu } from '../model/formValues';
import type { FormControls } from '../model/useCafeteriaForm';
import { SideList } from './SideList';

type MenuBlockProps = FormControls & {
  item: FormMenu;
  /** 이 코너 MAIN의 기본가. 가격 칸 placeholder로만 보여 준다. 없으면 null */
  defaultPrice: number | null;
};

/** 메뉴 하나의 수정 칸. 카드와 같은 순서(메뉴명, 사이드, 가격)로 두고, 바뀐 칸은 success, 검증 실패는 error로 표시한다. */
export function MenuBlock({ item, defaultPrice, errors, dispatch }: MenuBlockProps) {
  const nameError = errors.get(`${item.key}.name`);
  const priceError = errors.get(`${item.key}.price`);

  return (
    <div className="flex min-w-0 flex-col gap-[8px] bg-white py-[12px] pl-[16px] pr-[12px]">
      <div className="flex items-start gap-[4px]">
        <TextField
          className="flex-1"
          label="메뉴명"
          placeholder="메뉴명"
          value={item.name}
          status={nameError ? 'error' : isNameChanged(item) ? 'success' : 'default'}
          helpText={nameError}
          onChange={(event) => dispatch({ type: 'updateItem', itemKey: item.key, name: event.target.value })}
          // 입력 중엔 자리를 지키고, 칸을 벗어나면 apis 저장 순서(이름순)로 자리를 옮긴다.
          onBlur={() => dispatch({ type: 'sortSection', itemKey: item.key })}
        />
        <div className="mt-[20px] flex">
          <IconButton
            icon="keyboardArrowDown"
            label={`${item.name || '새 메뉴'} 첫 사이드로`}
            className="!w-[24px] disabled:opacity-30"
            disabled={item.sides.length === 0}
            onClick={() => dispatch({ type: 'swapNameWithFirstSide', itemKey: item.key })}
          />
          <IconButton
            icon="delete"
            label={`${item.name || '새 메뉴'} 삭제`}
            className="!w-[24px]"
            onClick={() => dispatch({ type: 'removeItem', itemKey: item.key })}
          />
        </div>
      </div>
      <SideList item={item} errors={errors} dispatch={dispatch} />
      <TextField
        className="max-w-[50%]"
        label="가격"
        inputMode="numeric"
        placeholder={defaultPrice !== null ? `기본가 ${defaultPrice}` : '가격 입력'}
        suffix="원"
        value={item.price}
        status={priceError ? 'error' : isPriceChanged(item) ? 'success' : 'default'}
        helpText={priceError}
        onChange={(event) => dispatch({ type: 'updateItem', itemKey: item.key, price: event.target.value })}
      />
    </div>
  );
}
