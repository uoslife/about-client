import { TabName } from '../AmplitudePropertyType';

export const makeLikeArticleParameter = (
  tabName: TabName,
  articleId: string,
) => ({
  tab_name: tabName,
  article_id: articleId,
});
