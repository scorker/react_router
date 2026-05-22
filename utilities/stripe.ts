import { loadStripe } from "@stripe/stripe-js/pure";
import type { Stripe } from "@stripe/stripe-js";

export const getStripe = (): Promise<Stripe | null> => {
  const stripePublishableKey =
    process.env.NODE_ENV === "production"
      ? "pk_live_51GxzB6FQ8tU2VmRuSkgfhmWioyfOQwEYnCX2TBrbKNYlKGD9YZkufezTf9Zy5CCTmxsOz1HwagrrmGPcxvlgPYiY00odjejsAJ"
      : "pk_test_51GxzB6FQ8tU2VmRuTC3ufD9Vty8befyESFWsIsl9q5pyZEjl996fwL2bRx2wwLA1QCDfAHe5mo5dqNzidEkOGf9l00uBZXYCNp";

  return loadStripe(stripePublishableKey);
};
