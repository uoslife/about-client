'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfirmModal } from './ConfirmModal';

interface ConfirmModalState {
  isVisible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm?: () => void;
}

interface ConfirmModalContextType {
  showConfirmModal: (options: Omit<ConfirmModalState, 'isVisible'>) => void;
  hideConfirmModal: () => void;
  state: ConfirmModalState;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(
  undefined,
);

interface ConfirmModalProviderProps {
  children: ReactNode;
}

export const ConfirmModalProvider: React.FC<ConfirmModalProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ConfirmModalState>({
    isVisible: false,
    title: '',
    description: '',
    confirmText: '확인',
    cancelText: '취소',
    variant: 'default',
    onConfirm: undefined,
  });

  const showConfirmModal = (options: Omit<ConfirmModalState, 'isVisible'>) => {
    setState({
      ...options,
      isVisible: true,
    });
  };

  const hideConfirmModal = () => {
    setState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <ConfirmModalContext.Provider
      value={{
        showConfirmModal,
        hideConfirmModal,
        state,
      }}
    >
      {children}
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModalContext = () => {
  const context = useContext(ConfirmModalContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmModalContext must be used within a ConfirmModalProvider',
    );
  }
  return context;
};

export const ConfirmModalRenderer = () => {
  const { state, hideConfirmModal } = useConfirmModalContext();
  return (
    <ConfirmModal
      isVisible={state.isVisible}
      onClose={hideConfirmModal}
      onConfirm={state.onConfirm || (() => {})}
      title={state.title}
      description={state.description}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      variant={state.variant}
    />
  );
};
