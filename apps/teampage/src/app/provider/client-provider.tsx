"use client";
import { SessionProvider } from "next-auth/react";

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
};
