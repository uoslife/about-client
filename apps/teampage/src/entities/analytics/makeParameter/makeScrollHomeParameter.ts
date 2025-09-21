import { HomeScrollSection, TabName } from '../AmplitudePropertyType';

export const makeScrollHomeParameter = (
  tabName: TabName,
  scrollSection: HomeScrollSection,
) => ({
  tab_name: tabName,
  scroll_section: scrollSection,
});
