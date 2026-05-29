const REFERRAL_ATTRIBUTION_COOKIE = "styler_referral_attribution";
const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

type ReferralAttribution = {
  promoCode: string;
  capturedAt: string;
  landingPath?: string;
};

const REFERRAL_PROMO_QUERY_KEYS = ["promo", "ref", "referral", "code"];

const getCookieValue = (cookieName: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const encodedName = `${cookieName}=`;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(encodedName));

  if (!cookie) {
    return null;
  }

  return cookie.slice(encodedName.length);
};

const setCookieValue = (cookieName: string, value: string): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${cookieName}=${value}; Path=/; Max-Age=${REFERRAL_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
};

export const getPromoCodeFromSearch = (search: string): string | null => {
  if (!search) {
    return null;
  }

  const params = new URLSearchParams(search);

  for (const key of REFERRAL_PROMO_QUERY_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      return value;
    }
  }

  return null;
};

export const captureReferralAttributionFromSearch = (
  search: string,
  landingPath?: string,
): ReferralAttribution | null => {
  const promoCode = getPromoCodeFromSearch(search);

  if (!promoCode) {
    return null;
  }

  const attribution: ReferralAttribution = {
    promoCode,
    capturedAt: new Date().toISOString(),
    landingPath,
  };

  setCookieValue(
    REFERRAL_ATTRIBUTION_COOKIE,
    encodeURIComponent(JSON.stringify(attribution)),
  );

  return attribution;
};

export const getReferralAttribution = (): ReferralAttribution | null => {
  const rawCookieValue = getCookieValue(REFERRAL_ATTRIBUTION_COOKIE);

  if (!rawCookieValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawCookieValue));
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.promoCode === "string" &&
      parsed.promoCode.trim().length > 0
    ) {
      return {
        promoCode: parsed.promoCode.trim(),
        capturedAt:
          typeof parsed.capturedAt === "string"
            ? parsed.capturedAt
            : new Date().toISOString(),
        landingPath:
          typeof parsed.landingPath === "string"
            ? parsed.landingPath
            : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const getStoredReferralPromoCode = (): string | null => {
  return getReferralAttribution()?.promoCode ?? null;
};
