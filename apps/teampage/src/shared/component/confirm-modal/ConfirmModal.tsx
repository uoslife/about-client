'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Text } from '@/shared/component/Text';

interface ConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
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

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Dim background */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-[16px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] p-6 w-full max-w-[400px]"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            {/* Content */}
            <div className="flex flex-col gap-6">
              {/* Text content */}
              <div className="flex flex-col gap-2">
                <Text
                  variant="title-24-b"
                  color="grey-900"
                  className="leading-[1.5]"
                >
                  {title}
                </Text>
                {description && (
                  <Text
                    variant="body-16-m"
                    color="grey-700"
                    className="leading-[1.6]"
                  >
                    {description}
                  </Text>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="bg-[#f7f7f9] hover:bg-[#e9e9ee] transition-colors duration-200 flex items-center justify-center px-5 py-3 h-12 rounded-[12px] min-w-[80px]"
                >
                  <Text variant="body-20-m" color="grey-700">
                    {cancelText}
                  </Text>
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`${
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#222227] hover:bg-[#1a1a1f]'
                  } transition-colors duration-200 flex items-center justify-center px-5 py-3 h-12 rounded-[12px] min-w-[80px]`}
                >
                  <Text variant="body-20-m" color="white">
                    {confirmText}
                  </Text>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
