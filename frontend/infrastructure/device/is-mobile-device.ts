// Detects mobile devices via client metadata (User-Agent Client Hints where
// available, User-Agent string otherwise) - deliberately not viewport size,
// so a narrow desktop window (or a resized browser) never counts as mobile
// and a wide-viewport tablet/phone in landscape still does.
const MOBILE_USER_AGENT_PATTERN = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export function isMobileDevice(): boolean {
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (typeof uaData?.mobile === "boolean") {
    return uaData.mobile;
  }
  return MOBILE_USER_AGENT_PATTERN.test(navigator.userAgent);
}
