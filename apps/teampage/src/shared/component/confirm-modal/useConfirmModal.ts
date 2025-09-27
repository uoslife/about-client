import { useCallback } from 'react';
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
      description?: string;
      confirmText?: string;
      cancelText?: string;
      variant?: 'default' | 'danger';
      useCancel?: boolean;
      onConfirm: () => void;
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
