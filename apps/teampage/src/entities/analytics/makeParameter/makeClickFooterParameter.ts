import { FooterName } from '../AmplitudePropertyType';

export const makeClickFooterParameter = (footerName: FooterName) => ({
  footer_name: footerName,
});
