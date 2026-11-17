'use client';
import { Fragment } from 'react';
import { Button } from '@/shared/component/ds';
import { getDefaultPrice } from '@/entities/cafeteria';
import { sectionOf, type FormCorner, type Role } from '../model/formValues';
import type { CafeteriaFormEditor } from '../model/useCafeteriaForm';
import { MenuBlock } from './MenuBlock';
import { RemovedRow } from './RemovedRow';

export const Divider = () => <div className="h-px bg-[#e2e8f0]" />;

/** MAIN 또는 SUB 섹션 */
export function MenuSection({ corner, role, editor }: { corner: FormCorner; role: Role; editor: CafeteriaFormEditor }) {
  const items = corner[sectionOf(role)];
  const defaultPrice = role === 'MAIN' ? getDefaultPrice(editor.form.loaded.name, corner.corner) : null;

  return (
    <div className="flex flex-col">
      <div className="px-[16px] pt-[12px] text-[13px] font-semibold leading-[1.3] text-[#64748b]">{role}</div>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 && <Divider />}
          {item.removed ? (
            <RemovedRow item={item} onRestore={() => editor.dispatch({ type: 'restoreItem', itemKey: item.key })} />
          ) : (
            <MenuBlock item={item} defaultPrice={defaultPrice} errors={editor.errors} dispatch={editor.dispatch} />
          )}
        </Fragment>
      ))}
      {items.length > 0 && <Divider />}
      <div className="px-[16px] pb-[12px] pt-[8px]">
        <Button
          variant="weak"
          color="blue"
          icon="add"
          onClick={() => editor.dispatch({ type: 'addItem', cornerKey: corner.key, role })}
        >
          {role} 메뉴 추가
        </Button>
      </div>
    </div>
  );
}
