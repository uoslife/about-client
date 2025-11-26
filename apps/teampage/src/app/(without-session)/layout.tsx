import { SessionProvider } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider session={null}>
      <ClientProvider>{children}</ClientProvider>
    </SessionProvider>
  );
}
