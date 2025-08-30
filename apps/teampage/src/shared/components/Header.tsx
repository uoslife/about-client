'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../auth/useAuth';

const Route = {
  HOME: {
    path: '/',
    name: 'Home',
  },
  PEOPLE: {
    path: '/people',
    name: 'People',
  },
  TECH: {
    path: '/tech',
    name: 'Tech',
  },
  OUR_STORY: {
    path: '/our-story',
    name: 'Our Story',
  },
} as const;

export default function Header() {
  const { status, signIn, session, signOut } = useAuth();

  return (
    <header
      className="sticky top-0 z-1 h-[60px] backdrop-blur-[25px] backdrop-filter bg-[rgba(255,255,255,0.8)] flex flex-row items-center justify-between px-[60px] w-full"
      data-name="GNB"
    >
      <Link href="/">
        <Image
          src="/svg/uoslife_logo.svg"
          alt="uoslife logo icon"
          height={28}
          width={80}
        />
      </Link>
      <div className="absolute box-border content-stretch flex flex-row gap-4 items-center justify-start left-1/2 p-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {Object.values(Route).map((route) => (
          <Link href={route.path} className="w-full" key={route.path}>
            <div
              className="content-stretch flex items-center justify-center px-[10px] py-[12px]"
              data-name={`GNB_Tap_${route.name}`}
            >
              <p className="text-[18px] whitespace-pre hover:text-[#4686ff] cursor-pointer">
                {route.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0">
        <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
            <Image
              src="/svg/search.svg"
              alt="search icon"
              width={44}
              height={44}
              className="hover:bg-gray-100 rounded-xl"
            />
            <a
              href="https://instagram.com/uoslife_official"
              target="_blank"
              rel="noopener"
              className="hover:bg-gray-100 rounded-xl"
            >
              <Image
                src="/svg/instagram.svg"
                alt="instagram icon"
                width={44}
                height={44}
              />
            </a>
            <a
              href="https://github.com/uoslife"
              target="_blank"
              rel="noopener"
              className="hover:bg-gray-100 rounded-xl"
            >
              <Image
                src="/svg/github.svg"
                alt="github icon"
                width={44}
                height={44}
              />
            </a>
          </div>
        </div>
        {status === 'unauthenticated' ? (
          <div className="flex justify-center items-center gap-7">
            <div className="bg-[#72727C] h-[20px] w-[1px]" />
            <button
              type="button"
              onClick={() => signIn('keycloak')}
              className="flex justify-center items-center px-5 py-[5px] rounded-[8px] border border-[#0F6EFB] bg-[#0F6EFB33] hover:bg-[#0F6EFB] hover:text-white text-[#0F6EFB]"
            >
              <p className="text-center text-[18px] font-bold whitespace-pre">
                Login
              </p>
            </button>
          </div>
        ) : (
          <div
            className="flex justify-center items-center gap-7 cursor-pointer"
            onClick={() => signOut()}
          >
            <p className="text-[18px] font-bold whitespace-pre">
              {session?.user?.name}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
