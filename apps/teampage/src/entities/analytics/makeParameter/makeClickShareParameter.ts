import { TabName } from '../AmplitudePropertyType';

export const makeClickShareParameter = (
  tabName: TabName,
  articleId: string,
) => ({
  tab_name: tabName,
  article_id: articleId,
});
