import { useCallback, type ReactNode } from 'react';
import {
  useConfirmModalActions,
  useConfirmModalState,
} from './ConfirmModalContext';

export const useConfirmModal = () => {
  const { showConfirmModal, hideConfirmModal } = useConfirmModalActions();
  const { state } = useConfirmModalState();

  const open = useCallback(
    (options: {
      title: string;
      description?: ReactNode;
      confirmText?: string;
      cancelText?: string;
      variant?: 'default' | 'danger';
      useCancel?: boolean;
      onConfirm: () => void;
      onOutsideClick?: () => void;
    }) => {
      showConfirmModal(options);
    },
    [showConfirmModal],
  );

  const close = useCallback(() => {
    hideConfirmModal();
  }, [hideConfirmModal]);

  return {
    open,
    close,
    state,
  };
};
