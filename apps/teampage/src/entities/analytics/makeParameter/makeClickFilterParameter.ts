import { FilterName, TabName } from '../AmplitudePropertyType';

export const makeClickFilterParameter = (
  tabName: TabName,
  filterName: FilterName,
) => ({
  tab_name: tabName,
  filter_name: filterName,
});
