import { LinkType } from '../AmplitudePropertyType';

export const makeClickPeopleLinkParameter = (linkType: LinkType) => ({
  link_type: linkType,
});
