'use client';
import { useMemo, useReducer, type Dispatch } from 'react';
import { isSameCafeteria, validateCafeteria, type Cafeteria } from '@/entities/cafeteria';
import { formReducer, toCafeteria, toFormValues, type FormValues, type FormAction } from './formValues';

type State = { resetKey: string; form: FormValues } | null;

const reducer = (state: State, action: FormAction | { type: 'init'; resetKey: string; loaded: Cafeteria }): State => {
  if (action.type === 'init') return { resetKey: action.resetKey, form: toFormValues(action.loaded) };
  return state && { ...state, form: formReducer(state.form, action) };
};

export const useCafeteriaForm = (loaded: Cafeteria | undefined, resetKey: string) => {
  const [state, dispatch] = useReducer(reducer, null);

  // 렌더 중 동기 초기화: 이펙트로 하면 다른 식당의 폼 값이 한 번 그려진다.
  if (loaded && state?.resetKey !== resetKey) dispatch({ type: 'init', resetKey, loaded });
  const form = state?.resetKey === resetKey ? state.form : null;

  const derived = useMemo(() => {
    if (!form) return null;
    const { cafeteria: next, paths } = toCafeteria(form);
    /** 수정 폼 칸 key → 에러 문구 */
    const errors = new Map<string, string>();
    validateCafeteria(next).forEach(({ path, message }) => {
      const fieldKey = paths.get(path) ?? path;
      if (!errors.has(fieldKey)) errors.set(fieldKey, message);
    });
    const dirty = !isSameCafeteria(form.loaded, next);
    return { next, errors, dirty, canSave: dirty && errors.size === 0 };
  }, [form]);

  return form && derived ? { form, dispatch, ...derived } : null;
};

export type CafeteriaFormEditor = NonNullable<ReturnType<typeof useCafeteriaForm>>;

/** 말단 입력 컴포넌트가 받는 최소 계약: 칸별 에러와 폼 값 변경 요청. */
export type FormControls = { errors: ReadonlyMap<string, string>; dispatch: Dispatch<FormAction> };
