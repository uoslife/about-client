export type TabName = 'home' | 'tech' | 'career' | 'moments' | 'people';
export type MemberRole = 'guest' | 'associate_member' | 'full_member' | 'admin';
export type FilterName =
  | 'PM'
  | '개발'
  | '디자인'
  | '마케팅'
  | '최신순'
  | '인기순';
export type HomeScrollSection =
  | '1_values'
  | '2_app_download'
  | '3_curriculum'
  | '4_tech'
  | '5_interview'
  | '6_recruit';
export type DeviceType = 'pc' | 'mobile';
export type FooterName = 'instagram' | 'github' | 'kakao' | 'mail';
export type GnbIconName = 'kakao' | 'instagram' | 'github';
export type LinkType = 'github' | 'notion' | 'linkedin' | 'others';

export type AmplitudePropertyType = {
  tab_name: TabName;
  member_role: MemberRole;
  article_id: string;
  filter_name: FilterName;
  keyword: string;
  scroll_section: HomeScrollSection;
  device: DeviceType;
  footer_name: FooterName;
  link_type: LinkType;
  gnb_icon_name: GnbIconName;
};
