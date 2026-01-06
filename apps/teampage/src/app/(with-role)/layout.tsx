import { SessionProvider } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';
import { BackofficeHeader } from '@/widgets/backoffice-header/BackOfficeHeader';
import { RoleGuard } from './RoleGuard';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider session={null}>
      <ClientProvider>
        <RoleGuard>
          <div className="min-h-full flex flex-col mx-40 max-md:mx-2">
            <BackofficeHeader />
            <main className="flex-1 w-full flex flex-col items-center">{children}</main>
          </div>
        </RoleGuard>
      </ClientProvider>
    </SessionProvider>
  );
}
