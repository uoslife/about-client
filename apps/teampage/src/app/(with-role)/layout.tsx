import { SessionProvider } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';
import { BackofficeHeader } from '@/widgets/backoffice-header/BackOfficeHeader';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: 비로그인시 / 리다이렉트 처리
  return (
    <SessionProvider session={null}>
      <ClientProvider>
        <div className="min-h-full flex flex-col">
          <BackofficeHeader />
          <main className="flex-1 w-full flex flex-col items-center">{children}</main>
        </div>
      </ClientProvider>
    </SessionProvider>
  );
}
