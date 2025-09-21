import { TabName } from '../AmplitudePropertyType';

export const makeSearchKeywordParameter = (
  tabName: TabName,
  keyword: string,
) => ({
  tab_name: tabName,
  keyword,
});
