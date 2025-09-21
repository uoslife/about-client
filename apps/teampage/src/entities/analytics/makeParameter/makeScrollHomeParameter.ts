import { HomeScrollSection, TabName } from '../AmplitudePropertyType';

export const makeScrollHomeParameter = (
  tabName: TabName,
  articleId: string,
  scrollSection: HomeScrollSection,
) => ({
  tab_name: tabName,
  article_id: articleId,
  scroll_section: scrollSection,
});
