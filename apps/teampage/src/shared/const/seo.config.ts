
type MetaConfig = {
    title: string;
    description: string;
    keywords: string;
    author: string;
    email: string;
    siteUrl: string;
    sitename: string;
    image: string;
    icon: string;
    locale: string;
    type: 'website';
};

const metaData: MetaConfig = {
    title: 'UOSLIFE',
    sitename: 'Team UOSLIFE',
    author: 'UOSLIFE-admin',
    email: 'support@uoslife.team',
    description: '시대생, 모든 시대인을— 연결하다, uoslife',
    keywords:
        'UOSLIFE, uoslif, 동아리, 연합 동아리, IT 동아리, 개발 동아리, 대학교 동아리, 대학생 연합 동아리, 개발, 개발자, 프론트엔드, 백엔드, 디자이너, PM',
    type: 'website',
    siteUrl: 'https://www.uoslife.team',
    icon: '/img/uoslife_logo_white.png',
    image: '/img/preview.png',
    locale: 'ko_KR',
};
export default metaData;