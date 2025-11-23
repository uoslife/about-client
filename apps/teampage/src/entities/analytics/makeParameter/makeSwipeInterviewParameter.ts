import { HomeScrollSection, TabName } from '../AmplitudePropertyType';

export const makeSwipeInterviewParameter = (tabName: TabName, scrollSection: HomeScrollSection) => ({
  tab_name: tabName,
  scroll_section: scrollSection,
});
