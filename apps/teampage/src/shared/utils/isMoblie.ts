export const isMobile = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  const agent = navigator && navigator.userAgent.toLowerCase();
  const isMobileDevice =
    /iphone|ipod|ipad|android|blackberry|fennec|samsungbrowser/.test(agent);
  return isMobileDevice;
};
