export enum CategoryEnum {
  DEVELOP = 'DEVELOP',
  DESIGN = 'DESIGN',
  MARKETING = 'MARKETING',
  PM = 'PM',
  EMPLOYMENT = 'EMPLOYMENT',
  EXTERNAL_ACTIVITY = 'EXTERNAL_ACTIVITY',
}

export enum CategoryAllEnum {
  ALL = 'ALL',
}

export enum SpaceEnum {
  TECH = 'TECH',
  CAREER = 'CAREER',
  MOMENTS = 'MOMENTS',
}

export type SpaceType = keyof typeof SpaceEnum;

export enum SpaceIdEnum {
  TECH = 3,
  CAREER = 4,
  MOMENTS = 5,
}

export type CategoryType = keyof typeof CategoryEnum;
export type CategoryAllType = keyof typeof CategoryAllEnum;

export type CategoryTypeWithALL = CategoryType | CategoryAllType;

export const CategoryKorean = {
  [CategoryEnum.DEVELOP]: '개발',
  [CategoryEnum.DESIGN]: '디자인',
  [CategoryEnum.MARKETING]: '마케팅',
  [CategoryEnum.PM]: '기획',
  [CategoryEnum.EMPLOYMENT]: '취업∙인턴',
  [CategoryEnum.EXTERNAL_ACTIVITY]: '대외활동',
};

export const CategoryKoreanWithAll = Object.assign(CategoryKorean, {
  [CategoryAllEnum.ALL]: '전체',
});

export const CAREER_CATEGORIES = [
  CategoryAllEnum.ALL,
  CategoryEnum.EMPLOYMENT,
  CategoryEnum.EXTERNAL_ACTIVITY,
] as const;

export const TECH_CATEGORIES = [
  CategoryAllEnum.ALL,
  CategoryEnum.PM,
  CategoryEnum.MARKETING,
  CategoryEnum.DESIGN,
  CategoryEnum.DEVELOP,
] as const;

export enum SortEnum {
  LATEST = 'LATEST',
  POPULAR = 'POPULAR',
}

export type SortType = keyof typeof SortEnum;

export const SortKorean = {
  [SortEnum.LATEST]: '최신순',
  [SortEnum.POPULAR]: '인기순',
};
