import { HomeScrollSection, TabName } from '../AmplitudePropertyType';

export const makeSwiptCurriculamParameter = (tabName: TabName, scrollSection: HomeScrollSection) => ({
  tab_name: tabName,
  scroll_section: scrollSection,
});
