import { TabName } from '../AmplitudePropertyType';

export const makePostArticleParameter = (tabName: TabName) => ({
  tab_name: tabName,
});
