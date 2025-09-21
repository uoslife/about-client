'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Toast } from './Toast';

interface ToastStateContextType {
  message: string;
  isVisible: boolean;
}

interface ToastActionsContextType {
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastStateContext = createContext<ToastStateContextType | undefined>(
  undefined,
);
const ToastActionsContext = createContext<ToastActionsContextType | undefined>(
  undefined,
);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((newMessage: string, newDuration = 3000) => {
    setMessage(newMessage);
    setIsVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, newDuration);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  const stateValue = useMemo(
    () => ({
      message,
      isVisible,
    }),
    [message, isVisible],
  );

  const actionsValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast],
  );

  return (
    <ToastStateContext.Provider value={stateValue}>
      <ToastActionsContext.Provider value={actionsValue}>
        {children}
      </ToastActionsContext.Provider>
    </ToastStateContext.Provider>
  );
};

export const useToastState = () => {
  const context = useContext(ToastStateContext);
  if (context === undefined) {
    throw new Error('useToastState must be used within a ToastProvider');
  }
  return context;
};

export const useToastActions = () => {
  const context = useContext(ToastActionsContext);
  if (context === undefined) {
    throw new Error('useToastActions must be used within a ToastProvider');
  }
  return context;
};

export const ToastRenderer = () => {
  const { message, isVisible } = useToastState();
  const { hideToast } = useToastActions();
  return <Toast message={message} isVisible={isVisible} onClose={hideToast} />;
};
