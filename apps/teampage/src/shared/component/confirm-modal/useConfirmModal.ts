import {
  useConfirmModalActions,
  useConfirmModalState,
} from './ConfirmModalContext';

export const useConfirmModal = () => {
  const { showConfirmModal, hideConfirmModal } = useConfirmModalActions();
  const { state } = useConfirmModalState();

  const open = (options: {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    onConfirm: () => void;
  }) => {
    showConfirmModal(options);
  };

  const close = () => {
    hideConfirmModal();
  };

  return {
    open,
    close,
    state,
  };
};
