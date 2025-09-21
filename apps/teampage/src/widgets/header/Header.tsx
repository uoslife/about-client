'use client';
import { useAuth } from '@entities/auth/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { Text } from '@/shared/component/Text';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

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
    path: '/career',
    name: 'Our Story',
  },
} as const;

export default function Header() {
  const { status, signIn, session, signOut } = useAuth();
  const { trackEvent } = useAnalytics();

  const renderLink = useCallback((route: { path: string; name: string }) => {
    const isShowOurStoryMenu = route.path === Route.OUR_STORY.path;
    return (
      <div
        className={`relative ${isShowOurStoryMenu ? 'group' : ''}`}
        key={route.path}
      >
        <Link href={route.path} className="w-full group">
          <div
            className="content-stretch flex items-center justify-center px-[10px] py-[12px]"
            data-name={`GNB_Tap_${route.name}`}
          >
            <p className="text-[18px] whitespace-pre hover:text-[#4686ff] cursor-pointer">
              {route.name}
            </p>
          </div>
        </Link>
        <OurStoryMenu />
      </div>
    );
  }, []);

  return (
    <header
      className={twMerge(
        'w-full h-[64px] sticky top-0 z-50 px-10 py-4',
        'grid grid-cols-3',
        'items-center content-center',
        'justify-items-stretch',
        'bg-white',
      )}
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
      <div className="flex flex-row gap-4 items-center justify-center">
        {Object.values(Route).map((route) => renderLink(route))}
      </div>
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-end p-0 relative shrink-0">
        <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start p-0 relative shrink-0">
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0">
            <Link
              href="http://pf.kakao.com/_gMEHK"
              target="_blank"
              rel="noopener"
            >
              <Image
                src="/svg/kakao.svg"
                alt="search icon"
                width={44}
                height={44}
                className="hover:bg-gray-100 rounded-xl"
                onClick={() => {
                  trackEvent('CLICK_GNB', {
                    gnb_icon_name: 'kakao',
                  });
                }}
              />
            </Link>
            <Link
              href="https://instagram.com/uoslife_official"
              target="_blank"
              rel="noopener"
              className="hover:bg-gray-100 rounded-xl"
              onClick={() => {
                trackEvent('CLICK_GNB', {
                  gnb_icon_name: 'instagram',
                });
              }}
            >
              <Image
                src="/svg/instagram.svg"
                alt="instagram icon"
                width={44}
                height={44}
              />
            </Link>
            <Link
              href="https://github.com/uoslife"
              target="_blank"
              rel="noopener"
              className="hover:bg-gray-100 rounded-xl"
              onClick={() => {
                trackEvent('CLICK_GNB', {
                  gnb_icon_name: 'github',
                });
              }}
            >
              <Image
                src="/svg/github.svg"
                alt="github icon"
                width={44}
                height={44}
              />
            </Link>
          </div>
        </div>
        {/* 비회원 혹은 인증 내역을 얻기 전 */}
        {status === undefined ||
          (status === 'unauthenticated' && (
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
          ))}
        {/* 인증된 사용자의 경우 */}
        {status === 'authenticated' && (
          <div className="flex flex-row items-center justify-center gap-[6px]">
            <Text variant="body-18-b" color="grey-700">
              {session?.user?.name}
            </Text>
            <button type="button" onClick={() => signOut()}>
              <Image
                src="/svg/logout.svg"
                alt="logout icon"
                width={24}
                height={24}
              />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function OurStoryMenu() {
  return (
    <div className="hidden group-hover:block absolute top-full w-40 bg-white box-border flex-col gap-2 items-start justify-start p-[12px] rounded-2xl shadow-[0px_0px_12px_0px_rgba(18,18,18,0.1)]">
      <Link href="/career" className="w-full group/career">
        <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
          <Text
            variant="body-18-m"
            className="group-hover/career:text-primary-ui"
          >
            Career
          </Text>
        </div>
      </Link>
      <Link href="/moments" className="w-full group/moments">
        <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
          <Text
            variant="body-18-m"
            className="group-hover/moments:text-primary-ui"
          >
            Moments
          </Text>
        </div>
      </Link>
    </div>
  );
}
