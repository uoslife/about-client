import { TabName } from '../AmplitudePropertyType';

export const makePostCommentParameter = (
  tabName: TabName,
  articleId: string,
) => ({
  tab_name: tabName,
  article_id: articleId,
});
