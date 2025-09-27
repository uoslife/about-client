'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { ConfirmModal } from './ConfirmModal';

interface ConfirmModalState {
  isVisible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  useCancel?: boolean;
  onConfirm?: () => void;
}

interface ConfirmModalStateContextType {
  state: ConfirmModalState;
}

interface ConfirmModalActionsContextType {
  showConfirmModal: (options: Omit<ConfirmModalState, 'isVisible'>) => void;
  hideConfirmModal: () => void;
}

const ConfirmModalStateContext = createContext<
  ConfirmModalStateContextType | undefined
>(undefined);
const ConfirmModalActionsContext = createContext<
  ConfirmModalActionsContextType | undefined
>(undefined);

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
    useCancel: true,
    onConfirm: undefined,
  });

  const showConfirmModal = useCallback(
    (options: Omit<ConfirmModalState, 'isVisible'>) => {
      setState({
        ...options,
        isVisible: true,
      });
    },
    [],
  );

  const hideConfirmModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const stateValue = useMemo(
    () => ({
      state,
    }),
    [state],
  );

  const actionsValue = useMemo(
    () => ({
      showConfirmModal,
      hideConfirmModal,
    }),
    [showConfirmModal, hideConfirmModal],
  );

  return (
    <ConfirmModalStateContext.Provider value={stateValue}>
      <ConfirmModalActionsContext.Provider value={actionsValue}>
        {children}
      </ConfirmModalActionsContext.Provider>
    </ConfirmModalStateContext.Provider>
  );
};

export const useConfirmModalState = () => {
  const context = useContext(ConfirmModalStateContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmModalState must be used within a ConfirmModalProvider',
    );
  }
  return context;
};

export const useConfirmModalActions = () => {
  const context = useContext(ConfirmModalActionsContext);
  if (context === undefined) {
    throw new Error(
      'useConfirmModalActions must be used within a ConfirmModalProvider',
    );
  }
  return context;
};

export const ConfirmModalRenderer = () => {
  const { state } = useConfirmModalState();
  const { hideConfirmModal } = useConfirmModalActions();
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
      useCancel={state.useCancel}
    />
  );
};
