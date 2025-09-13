'use client';
import { createPortal } from 'react-dom';
import { ToastRenderer } from '@/shared/component/toast/ToastContext';
import { ConfirmModalRenderer } from '@/shared/component/confirm-modal/ConfirmModalContext';

export const DimRenderer = () => {
  return createPortal(
    <div className="portal_container">
      <ToastRenderer />
      <ConfirmModalRenderer />
    </div>,
    document.body,
  );
};
