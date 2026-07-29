'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '@/shared/component/Text';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onOutsideClick?: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  useCancel?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onOutsideClick,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  useCancel = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!mounted) return null;

  // 이전엔 motion(framer-motion)의 AnimatePresence/animate로 열림·닫힘 애니메이션을 걸었는데,
  // 두 가지 문제가 있었다: (1) exit 애니메이션 완료를 인식하지 못해 닫은 뒤에도 전체 화면
  // 오버레이가 DOM에 남아 페이지 클릭을 막았고, (2) 그걸 우회해 "항상 마운트 + animate로
  // opacity만 토글"하는 방식으로 바꿔도 닫힐 때(isVisible→false) opacity가 1→0으로
  // 전혀 전환되지 않는 현상이 있었다(원인 미상, 이 motion 패키지 버전 특유의 동작으로 보임).
  // 애니메이션 라이브러리에 의존하지 않도록 순수 CSS transition으로 전환해 결정적으로 동작하게 한다.
  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (onOutsideClick) {
            onOutsideClick();
          } else {
            onClose();
          }
        }}
      />

      <div
        className={`relative bg-white rounded-[16px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] p-6 w-full min-w-[650px] sm:max-w-[400px] transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-5'
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Text
              variant="title-24-b"
              color="grey-900"
              className="leading-[1.5] sm:text-[24px] text-[18px] w-full sm:w-auto"
            >
              {title}
            </Text>
            {description && (
              <Text
                variant="body-16-m"
                color="grey-700"
                className="leading-[1.6] sm:text-[16px] text-[14px] w-full sm:w-auto"
              >
                {description}
              </Text>
            )}
          </div>

          <div className="flex gap-3 justify-end w-full sm:w-auto">
            {useCancel && (
              <button
                onClick={onClose}
                className="bg-[#f7f7f9] hover:bg-[#e9e9ee] transition-colors duration-200 flex items-center justify-center px-3 sm:px-5 py-0 h-11 sm:h-12 rounded-[8px] sm:rounded-[12px] flex-1 sm:flex-none sm:min-w-[80px]"
              >
                <Text variant="body-20-m" color="grey-700" className="text-[16px] sm:text-[20px]">
                  {cancelText}
                </Text>
              </button>
            )}
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`${
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#222227] hover:bg-[#1a1a1f]'
              } transition-colors duration-200 flex items-center justify-center px-3 sm:px-5 py-0 h-11 sm:h-12 rounded-[8px] sm:rounded-[12px] flex-1 sm:flex-none sm:min-w-[80px]`}
            >
              <Text variant="body-20-m" color="white" className="text-[16px] sm:text-[20px]">
                {confirmText}
              </Text>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
