'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from 'react';

interface ToastContextType {
  message: string;
  isVisible: boolean;
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (newMessage: string, newDuration = 3000) => {
    setMessage(newMessage);
    setIsVisible(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, newDuration);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider
      value={{
        message,
        isVisible,
        showToast,
        hideToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
