import { TabName } from '../AmplitudePropertyType';

export const makeViewArticleParameter = (
  tabName: TabName,
  articleId: string,
) => ({
  tab_name: tabName,
  article_id: articleId,
});
