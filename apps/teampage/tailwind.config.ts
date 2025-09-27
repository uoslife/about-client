import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      maxWidth: {
        pc: '1440px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        black: '#000000',
        'grey-50': '#F7F7F9',
        'grey-100': '#E9E9EE',
        'grey-170': '#44444C',
        'grey-200': '#E1E1E7',
        'grey-300': '#D5D5DC',
        'grey-400': '#BFBFCB',
        'grey-500': '#A2A2AE',
        'grey-600': '#72727C',
        'grey-700': '#54545C',
        'grey-800': '#303037',
        'grey-900': '#222227',
        'primary-ui': '#0F6EFB',
        'primary-brand': '#4686FF',
        'primary-lighter-alt': '#E9F3FF',
      },
      fontFamily: {
        extrabold: ['Pretendard-ExtraBold', 'sans-serif'],
        bold: ['Pretendard-Bold', 'sans-serif'],
        semibold: ['Pretendard-SemiBold', 'sans-serif'],
        medium: ['Pretendard-Medium', 'sans-serif'],
      },
      fontSize: {
        'heading-220-b': ['220px', { lineHeight: '1', fontWeight: '700' }],
        'heading-100-b': ['100px', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-80-b': ['80px', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-76-b': ['76px', { lineHeight: '1', fontWeight: '900' }], // TODO: temp 삭제 후, 디자인시스템 확정시 수정
        'heading-72-b': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
        'title-60-b': ['60px', { lineHeight: '1.4', fontWeight: '700' }],
        'title-48-b': ['48px', { lineHeight: '1.4', fontWeight: '700' }],
        'title-40-b': ['40px', { lineHeight: '1.4', fontWeight: '700' }],
        'title-40-m': ['40px', { lineHeight: '1.4', fontWeight: '600' }],
        'title-36-b': ['36px', { lineHeight: '1.5', fontWeight: '700' }],
        'title-28-b': ['28px', { lineHeight: '1.5', fontWeight: '700' }],
        'title-28-m': ['28px', { lineHeight: '1.5', fontWeight: '500' }],
        'title-24-b': ['24px', { lineHeight: '1.5', fontWeight: '700' }],
        'title-24-m': ['24px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-20-b': ['20px', { lineHeight: '1.6', fontWeight: '700' }],
        'body-20-m': ['20px', { lineHeight: '1.6', fontWeight: '500' }],
        'body-18-b': ['18px', { lineHeight: '1.6', fontWeight: '700' }],
        'body-18-m': ['18px', { lineHeight: '1.6', fontWeight: '500' }],
        'body-16-b': ['16px', { lineHeight: '1.6', fontWeight: '700' }],
        'body-16-m': ['16px', { lineHeight: '1.6', fontWeight: '500' }],
        'body-14-sb': ['14px', { lineHeight: '1.6', fontWeight: '600' }],
        'body-14-m': ['14px', { lineHeight: '1.6', fontWeight: '500' }],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        fadeIn: 'fadeIn 1s ease-in-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
