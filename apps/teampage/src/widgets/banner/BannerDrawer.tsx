'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Text } from '@/shared/component/Text';
import { useBannerMotion } from './bannerMotion';

interface BannerDrawerProps {
  title: string;
  description?: string;
  /** 하단 고정 영역. 저장·닫기 버튼이 스크롤을 따라 사라지지 않게 한다. */
  footer?: ReactNode;
  width?: 'default' | 'wide';
  onClose: () => void;
  children: ReactNode;
}

/**
 * 우측 서랍.
 *
 * 목록 위에 얹어 목록의 맥락(어느 구좌·몇 번째)을 잃지 않게 한다.
 * confirm-modal 이 body 스크롤을 잠그므로 서랍 위에서 확인 모달을 띄워도
 * 스크롤 처리가 겹치지 않도록 닫힐 때 원래 값으로 되돌린다.
 */
export function BannerDrawer({ title, description, footer, width = 'default', onClose, children }: BannerDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const anim = useBannerMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div
        variants={anim.scrim}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={anim.transition}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <motion.aside
        variants={anim.drawer}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={anim.transition}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex h-full w-full flex-col bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] ${
          width === 'wide' ? 'max-w-[760px]' : 'max-w-[560px]'
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-grey-200 px-6 py-5">
          <div>
            <Text variant="title-20-b" color="grey-900">
              {title}
            </Text>
            {description && (
              <Text variant="body-12-m" color="grey-600">
                {description}
              </Text>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 rounded px-2 py-1 text-body-16-m text-grey-600 transition-colors hover:bg-grey-50 hover:text-grey-900"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && <div className="border-t border-grey-200 px-6 py-4">{footer}</div>}
      </motion.aside>
    </div>,
    document.body,
  );
}
