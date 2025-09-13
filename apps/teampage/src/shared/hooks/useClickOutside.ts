'use client';
import { useEffect, useCallback, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>({
  callback,
}: {
  callback: () => void;
}): { ref: React.RefObject<T> } => {
  const ref = useRef<T>(null);
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node & T)) {
        callback();
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  return { ref };
};
