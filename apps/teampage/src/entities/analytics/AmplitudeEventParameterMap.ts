import { makeViewTabParameter } from './makeParameter/makeViewTabParameter';
import { makeViewArticleParameter } from './makeParameter/makeViewArticleParameter';
import { makePostArticleParameter } from './makeParameter/makePostArticleParameter';
import { makePostCommentParameter } from './makeParameter/makePostCommentParameter';
import { makeLikeArticleParameter } from './makeParameter/makeLikeArticleParameter';
import { makeClickShareParameter } from './makeParameter/makeClickShareParameter';
import { makeClickDownloadParameter } from './makeParameter/makeClickDownloadParameter';
import { makeClickRecruitAlertParameter } from './makeParameter/makeClickRecruitAlertParameter';
import { makeClickGnbParameter } from './makeParameter/makeClickGnbParameter';
import { makeClickFooterParameter } from './makeParameter/makeClickFooterParameter';
import { makeClickPeopleLinkParameter } from './makeParameter/makeClickPeopleLinkParameter';
import { makeClickFilterParameter } from './makeParameter/makeClickFilterParameter';
import { makeSearchKeywordParameter } from './makeParameter/makeSearchKeywordParameter';
import { makeScrollHomeParameter } from './makeParameter/makeScrollHomeParameter';
import { makeScrollArticleParameter } from './makeParameter/makeScrollArticleParameter';
import { makeSwipeCurriculumParameter } from './makeParameter/makeSwipeCurriculumParameter';
import { makeSwipeInterviewParameter } from './makeParameter/makeSwipeInterviewParameter';

export const AmplitudeEventParameterMap = {
  VIEW_TAB: makeViewTabParameter,
  VIEW_ARTICLE: makeViewArticleParameter,
  POST_ARTICLE: makePostArticleParameter,
  POST_COMMENT: makePostCommentParameter,
  LIKE_ARTICLE: makeLikeArticleParameter,
  CLICK_SHARE: makeClickShareParameter,
  CLICK_DOWNLOAD: makeClickDownloadParameter,
  CLICK_RECRUIT_ALERT: makeClickRecruitAlertParameter,
  CLICK_GNB: makeClickGnbParameter,
  CLICK_FOOTER: makeClickFooterParameter,
  CLICK_PEOPLE_LINK: makeClickPeopleLinkParameter,
  CLICK_FILTER: makeClickFilterParameter,
  SEARCH_KEYWORD: makeSearchKeywordParameter,
  SCROLL_HOME: makeScrollHomeParameter,
  SCROLL_ARTICLE: makeScrollArticleParameter,
  SWIPE_CURRICULUM: makeSwipeCurriculumParameter,
  SWIPE_INTERVIEW: makeSwipeInterviewParameter,
} as const;

export const AmlitudeEventNameMapper = {
  VIEW_TAB: 'view_tab',
  VIEW_ARTICLE: 'view_article',
  POST_ARTICLE: 'post_article',
  POST_COMMENT: 'post_comment',
  LIKE_ARTICLE: 'like_article',
  CLICK_SHARE: 'click_share',
  CLICK_DOWNLOAD: 'click_download',
  CLICK_RECRUIT_ALERT: 'click_recruit_alert',
  CLICK_GNB: 'click_gnb',
  CLICK_FOOTER: 'click_footer',
  CLICK_PEOPLE_LINK: 'click_people_link',
  CLICK_FILTER: 'click_filter',
  SEARCH_KEYWORD: 'search_keyword',
  SCROLL_HOME: 'scroll_home',
  SCROLL_ARTICLE: 'scroll_article',
  SWIPE_CURRICULUM: 'swipe_curriculum',
  SWIPE_INTERVIEW: 'swipe_interview',
} as const;

export type AmplitudeEventName = keyof typeof AmplitudeEventParameterMap;
