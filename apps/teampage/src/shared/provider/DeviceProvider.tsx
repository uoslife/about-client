'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const DeviceContext = createContext<{ isMobile: boolean }>({ isMobile: false });

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <DeviceContext.Provider value={{ isMobile }}>{children}</DeviceContext.Provider>;
}

export function useDevice() {
  return useContext(DeviceContext);
}
