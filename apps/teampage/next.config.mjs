/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
  // 학식 편집기가 브라우저에서 apis를 같은 origin으로 부르도록 프록시 (apis CORS가 localhost:3000을 막음)
  async rewrites() {
    // UOSLIFE_APIS_ORIGIN으로 바꿀 수 있다(예: https://apis.dev.uoslife.com).
    const origin = process.env.UOSLIFE_APIS_ORIGIN ?? 'https://apis.uoslife.com';
    return [{ source: '/uoslife-apis/:path*', destination: `${origin}/:path*` }];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      // TODO: mock 이미지를 위한 임시 추가
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd544kp0ugcek4.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'velog.velcdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
