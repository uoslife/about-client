'use client';
import type { Cafeteria } from '../model';

function HotBadge() {
  return (
    <span className="inline-flex items-center rounded-[11px] bg-[#266efb2E] px-[6px] py-[3px] text-[12px] font-semibold leading-[1.3] text-[#1f58f1]">
      HOT
    </span>
  );
}

const Divider = () => <div className="h-px w-full bg-[#e2e8f0]" />;

const FOOD_BLOCK = 'w-full px-[16px] py-[12px] text-[15px] font-normal leading-[1.5] text-[#0f172a]';
const FOOD_NAME_MAIN = 'inline-flex items-center gap-[4px] text-[17px] font-semibold leading-[1.3] text-[#0f172a]';
const FOOD_SIDE = 'text-[13px] font-normal leading-[1.5] text-[#64748b]';
const FOOD_PRICE_MAIN = 'text-[15px] font-normal leading-[1.5] text-[#334155]';
const FOOD_PRICE_NUMBER = 'text-[17px] font-semibold leading-[1.3] text-[#0f172a]';

type CafeteriaCardProps = {
  cafeteria: Cafeteria;
  /** After 폰은 HOT을 미리 알 수 없어서 끈다. */
  showPopular?: boolean;
  selected?: boolean;
  onSelect?: () => void;
};

type MenusProps = { menus: Cafeteria['menus']; showPopular: boolean };

/** 일반 식당: 코너마다 메뉴명, 사이드, 가격을 세로로 쌓는다. 가격이 없으면 앱처럼 6,000원으로 보인다. */
function CornerMenus({ menus, showPopular }: MenusProps) {
  return menus.map((menu, menuIndex) => (
    <div key={menuIndex} className="flex flex-col items-stretch justify-center">
      <div className={FOOD_BLOCK}>
        {menu.corner && <span className="text-[13px] font-semibold leading-[1.3] text-[#64748b]">{menu.corner}</span>}
        {menu.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex flex-col gap-[4px]">
            <div className={FOOD_NAME_MAIN}>
              {item.name}
              {showPopular && item.isPopular && <HotBadge />}
            </div>
            {item.side?.length ? <div className={FOOD_SIDE}>{item.side.join(' / ')}</div> : null}
            <div className={FOOD_PRICE_MAIN}>
              <span className={FOOD_PRICE_NUMBER}>{item.price?.toLocaleString() || '6,000'}</span>원
            </div>
          </div>
        ))}
      </div>
      {menuIndex < menus.length - 1 && <Divider />}
    </div>
  ));
}

/** 양식당: MAIN은 큰 블록, SUB는 이름과 가격을 한 줄로 붙여 앱 양식당 카드처럼 보인다. */
function WesternMenus({ menus, showPopular }: MenusProps) {
  return menus.map((menu, menuIndex) => {
    const subItems = menu.items.filter((item) => item.role === 'SUB');
    return (
      <div key={menuIndex} className="flex flex-col items-stretch justify-center">
        {menu.items.map((item, itemIndex) => {
          const subIndex = subItems.indexOf(item);
          return (
            <div key={itemIndex} className="flex flex-col gap-[4px]">
              {item.role === 'MAIN' ? (
                <div className={FOOD_BLOCK}>
                  <div className={FOOD_NAME_MAIN}>
                    {item.name}
                    {showPopular && item.isPopular && <HotBadge />}
                  </div>
                  <div className={FOOD_PRICE_MAIN}>
                    <span className={FOOD_PRICE_NUMBER}>{item.price?.toLocaleString() ?? ''}</span>원
                  </div>
                </div>
              ) : (
                <div
                  className={`${subIndex === 0 ? 'pt-[12px]' : ''} ${subIndex === subItems.length - 1 ? 'pb-[12px]' : ''}`}
                >
                  <div className="flex w-full justify-between px-[16px] py-[4px]">
                    <div className="text-[13px] font-semibold leading-[1.3] text-[#334155]">
                      {item.name}
                      {showPopular && item.isPopular && <HotBadge />}
                    </div>
                    <div className="text-[13px] font-medium leading-[1.3] text-[#334155]">
                      {item.price?.toLocaleString() || '6,000'}원
                    </div>
                  </div>
                </div>
              )}
              {itemIndex < menu.items.length - 1 && item.role === 'MAIN' && <Divider />}
            </div>
          );
        })}
      </div>
    );
  });
}

/** 앱 학식 탭의 식당 카드 하나. onSelect가 있으면 카드를 눌러 식당을 고를 수 있다. */
export function CafeteriaCard({ cafeteria, showPopular = true, selected, onSelect }: CafeteriaCardProps) {
  const extra = cafeteria.extra ?? [];

  return (
    <div
      data-cafeteria-id={cafeteria.id}
      // 마우스는 카드 어디를 눌러도 고른다. 키보드·스크린리더는 헤더의 식당명 버튼으로 고른다(버튼 중첩을 피하려고 카드 자체는 버튼이 아님).
      onClick={onSelect}
      className={`overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${onSelect ? 'cursor-pointer' : ''} ${selected ? 'outline outline-2 outline-offset-2 outline-[#266efb]' : ''}`}
    >
      <div className="flex min-h-[48px] items-center bg-[#f8fafc] px-[16px] py-[8px] text-[15px] font-semibold leading-[1.3] text-[#334155]">
        {onSelect ? (
          <button
            type="button"
            aria-pressed={selected}
            aria-label={`${cafeteria.name} 고르기`}
            className="rounded outline-none focus-visible:ring-2 focus-visible:ring-[#266efb]"
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
          >
            {cafeteria.name}
          </button>
        ) : (
          <span>{cafeteria.name}</span>
        )}
      </div>

      {cafeteria.menus.length === 0 ? (
        <div className="flex h-[150px] items-center justify-center p-[16px] text-[15px] font-medium leading-[1.5] text-[#64748b]">
          오늘은 운영하지 않는 날이에요
        </div>
      ) : cafeteria.name === '양식당' ? (
        <WesternMenus menus={cafeteria.menus} showPopular={showPopular} />
      ) : (
        <CornerMenus menus={cafeteria.menus} showPopular={showPopular} />
      )}

      {extra.length > 0 && (
        <div className="flex flex-col items-stretch justify-center">
          <Divider />
          <div className={FOOD_BLOCK}>
            {extra.map((info, index) => (
              <div key={index} className={FOOD_SIDE}>
                {info}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
