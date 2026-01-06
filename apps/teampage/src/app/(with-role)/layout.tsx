import { SessionProvider } from '@/app/provider/session-provider';
import { ClientProvider } from '../provider/client-provider';
import { BackofficeHeader } from '@/widgets/backoffice-header/BackOfficeHeader';
import { useUser } from '@/entities/api/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { role } = useUser();

  useEffect(() => {
    if (role === 'GUEST') router.push('/');
  }, [role, router]);

  return (
    <SessionProvider session={null}>
      <ClientProvider>
        <div className="min-h-full flex flex-col mx-40 max-md:mx-2">
          <BackofficeHeader />
          <main className="flex-1 w-full flex flex-col items-center">{children}</main>
        </div>
      </ClientProvider>
    </SessionProvider>
  );
}
