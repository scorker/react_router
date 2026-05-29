import { describe, expect, it, beforeEach } from "vitest";
import {
  captureReferralAttributionFromSearch,
  getPromoCodeFromSearch,
  getReferralAttribution,
  refreshReferralAttributionWindow,
  getStoredReferralPromoCode,
} from "./attributionCookie";

const COOKIE_NAME = "styler_referral_attribution";

const clearReferralCookie = () => {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`;
};

describe("attributionCookie", () => {
  beforeEach(() => {
    clearReferralCookie();
  });

  it("extracts promo code from supported query params", () => {
    expect(getPromoCodeFromSearch("?promo=SAVE50")).toBe("SAVE50");
    expect(getPromoCodeFromSearch("?ref=ADVOCATE10")).toBe("ADVOCATE10");
    expect(getPromoCodeFromSearch("?referral=TEAM25")).toBe("TEAM25");
    expect(getPromoCodeFromSearch("?code=LAUNCH30")).toBe("LAUNCH30");
  });

  it("returns null when no promo query param exists", () => {
    expect(getPromoCodeFromSearch("?utm_source=adwords")).toBeNull();
  });

  it("captures and reads referral attribution from cookie", () => {
    const attribution = captureReferralAttributionFromSearch(
      "?promo=STYLER50",
      "/referral?promo=STYLER50",
    );

    expect(attribution?.promoCode).toBe("STYLER50");
    expect(getStoredReferralPromoCode()).toBe("STYLER50");

    const storedAttribution = getReferralAttribution();
    expect(storedAttribution?.landingPath).toBe("/referral?promo=STYLER50");
  });

  it("returns null for malformed attribution cookie payload", () => {
    document.cookie = `${COOKIE_NAME}=%E0%A4%A; Path=/`;

    expect(getReferralAttribution()).toBeNull();
    expect(getStoredReferralPromoCode()).toBeNull();
  });

  it("refreshes the attribution window when attribution already exists", () => {
    captureReferralAttributionFromSearch("?promo=ROLLING60", "/referral");

    const refreshedAttribution = refreshReferralAttributionWindow();

    expect(refreshedAttribution?.promoCode).toBe("ROLLING60");
    expect(getStoredReferralPromoCode()).toBe("ROLLING60");
  });
});
