/*eslint-disable*/
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// Framer motion
import { AnimatePresence, motion } from "framer-motion";
// API
import Api from "../../../api/index";

import {
  IconButton,
  Button,
  InputAdornment,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Close, Backup, Bolt } from "@mui/icons-material";
// Stripe
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";
// Lottie animation data
// @ts-ignore - no type declarations for JSON
import appliedCheckData from "../../../lotties/applied-check.json";

import { primaryColor } from "../../../styles/jss/nextjs-material-kit-pro.js";

interface PlanDataItem {
  business_account_type_id: number;
  amount: number;
  stripe_product_id: string;
}

interface AddonPriceData {
  amount: number;
  business_account_type_id: number;
}

interface AddonDataItem {
  business_account_addon_id: number;
  business_account_addon: string;
  stripe_product_id: string;
  priceData: AddonPriceData[];
}

interface PaymentFormState {
  planData: PlanDataItem[];
  addonData: AddonDataItem[];
  businessAccountTypeId: number | null;
  businessAccountAddonIds: number[];
  createAccountLoading: boolean;
  formComplete: boolean;
  firstname: string;
  lastname: string;
  businessName: string;
  email: string;
  password: string;
}

interface PromoData {
  valid: boolean;
  percentOff?: number;
  appliesTo?: string[];
  message?: string;
}

interface PaymentPageProps {
  classes: Record<string, string>;
  isVisible: boolean;
  formState: PaymentFormState;
  handleChange: (key: string, value: unknown) => void;
  removeSubscription: () => void;
  removeAddon: (id: number) => void;
}

export default function PaymentPage(props: PaymentPageProps) {
  const classes = props.classes;

  const [promoLoading, setPromoLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoData, setPromoData] = useState<PromoData | null>(null);
  const [cardElementError, setCardElementError] = useState<string | null>(null);
  const [cardElementComplete, setCardElementComplete] = useState(false);
  const [createAccountError, setCreateAccountError] = useState<string | null>(
    null,
  );
  // const [AnimatedNumbersComponent, setAnimatedNumbersComponent] =
  //   useState<React.ComponentType<any> | null>(null);
  // const [LottieComponent, setLottieComponent] =
  //   useState<React.ComponentType<any> | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    let isMounted = true;

    import("react-animated-numbers")
      .then((module) => {
        if (isMounted) {
          // setAnimatedNumbersComponent(
          //   () => module.default as React.ComponentType<any>,
          // );
        }
      })
      .catch(() => {
        // Keep static fallback if import fails.
      });

    import("react-lottie")
      .then((module) => {
        // if (isMounted) {
        //   setLottieComponent(() => module.default as React.ComponentType<any>);
        // }
      })
      .catch(() => {
        // Keep animation hidden if import fails.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: primaryColor[0],
        fontWeight: "500",
        fontFamily: '"Public Sans", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "17px",
        "::placeholder": {
          color: primaryColor[2],
        },
      },
      invalid: {
        color: "#d32f2f",
        iconColor: "#d32f2f",
      },
    },
  };

  const foundPlanObj = props.formState.planData?.find(
    (x) => x.business_account_type_id === props.formState.businessAccountTypeId,
  );

  const renderSubscription = () => {
    let planName, planDescription, planImg;
    switch (props.formState.businessAccountTypeId) {
      case 1:
        planName = "App & Booking";
        planDescription =
          "Your own iOS & Android app with our full suite of booking tools integrated.";
        planImg = "/img/product-img/app-and-booking-plan.png";
        break;
      case 2:
        planName = "Booking";
        planDescription =
          "Your own iOS and Android app with another booking system integrated.";
        planImg = "/img/product-img/booking-plan.png";
        break;
      case 3:
        planName = "App";
        planDescription =
          "Your own branded booking system with everything you need to grow.";
        planImg = "/img/product-img/app-plan.png";
        break;
      default:
        return null;
    }
    if (!foundPlanObj) return null;
    // Calculate discounted price
    let planPrice = foundPlanObj.amount / 100;
    let discountedPrice = planPrice;
    if (
      promoData?.valid &&
      promoData?.percentOff &&
      promoData?.appliesTo?.includes(foundPlanObj.stripe_product_id)
    ) {
      discountedPrice = planPrice * (1 - promoData.percentOff / 100);
    }
    return (
      <div
        className={classes.cartItemContainer}
        key={`subscription${props.formState.businessAccountTypeId}`}
      >
        <div className={classes.paymentCartItemRow}>
          <div className={classes.cartItemImage}>
            <img
              src={planImg}
              alt="Plan image"
              width={100}
              height={100}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div>
            <div
              className={classes.cartItemHeader}
              style={{ color: primaryColor[0] }}
            >
              YOUR PLAN
            </div>
            <div className={classes.cartItemTitle}>{planName} Plan</div>
            <div className={classes.cartItemDescription}>{planDescription}</div>
            <div className={classes.cartItemPrice}>
              <span
                className={
                  planPrice !== discountedPrice
                    ? classes.paymentDiscountedPriceText
                    : undefined
                }
              >
                £
                {Number.isInteger(planPrice)
                  ? Number(planPrice)
                  : Number(planPrice).toFixed(2)}
                {planPrice === discountedPrice ? "/month" : null}
              </span>
              {planPrice !== discountedPrice ? (
                <span>
                  £
                  {Number.isInteger(discountedPrice)
                    ? Number(discountedPrice)
                    : Number(discountedPrice).toFixed(2)}
                  /month
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <IconButton
            color="error"
            disabled={props.formState.createAccountLoading}
            onClick={() => props.removeSubscription()}
          >
            <Close />
          </IconButton>
        </div>
      </div>
    );
  };

  const getAddonPrice = (addonObj: AddonDataItem): number => {
    let addonPrice: number;
    switch (addonObj.priceData?.length) {
      case 0:
        return 0;
      case 1:
        addonPrice = addonObj.priceData[0].amount / 100;
        break;
      default: {
        const addonPriceObj = addonObj.priceData.find(
          (x) =>
            x.business_account_type_id ===
            foundPlanObj?.business_account_type_id,
        );
        addonPrice = addonPriceObj ? addonPriceObj.amount / 100 : 0;
      }
    }
    return addonPrice;
  };

  const renderAddon = (businessAccountAddonId: number) => {
    // Get add-on
    let addonObj = props.formState.addonData.find(
      (x) => x.business_account_addon_id === businessAccountAddonId,
    );
    if (!addonObj) {
      return;
    }
    // Calculate price
    const addonPrice = getAddonPrice(addonObj);
    // Calculate discounted price
    let discountedPrice = addonPrice;
    if (
      promoData?.valid &&
      promoData?.percentOff &&
      promoData?.appliesTo?.includes(addonObj.stripe_product_id)
    ) {
      discountedPrice = addonPrice * (1 - promoData.percentOff / 100);
    }
    // Icon
    let addonIcon;
    switch (businessAccountAddonId) {
      case 1:
        addonIcon = <Backup color="primary" style={{ fontSize: "3em" }} />;
        break;
      case 2:
        addonIcon = <Bolt color="primary" style={{ fontSize: "3.5em" }} />;
        break;
    }
    return (
      <div
        className={classes.cartItemContainer}
        key={`addon${businessAccountAddonId}`}
      >
        <div className={classes.paymentCartItemRow}>
          <div className={classes.cartItemImage}>{addonIcon}</div>
          <div>
            <div className={classes.cartItemHeader}>ADD-ON</div>
            <div className={classes.cartItemTitle}>
              {addonObj.business_account_addon}
            </div>
            <div className={classes.cartItemPrice}>
              <span
                className={
                  addonPrice !== discountedPrice
                    ? classes.paymentDiscountedPriceText
                    : undefined
                }
              >
                £
                {Number.isInteger(addonPrice)
                  ? Number(addonPrice)
                  : Number(addonPrice).toFixed(2)}
                {addonPrice === discountedPrice ? " one-time fee" : null}
              </span>
              {addonPrice !== discountedPrice ? (
                <span>
                  £
                  {Number.isInteger(discountedPrice)
                    ? Number(discountedPrice)
                    : Number(discountedPrice).toFixed(2)}{" "}
                  one-time fee
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <IconButton
            color="error"
            disabled={props.formState.createAccountLoading}
            onClick={() => props.removeAddon(businessAccountAddonId)}
          >
            <Close />
          </IconButton>
        </div>
      </div>
    );
  };

  const applyPromoCode = async () => {
    if (!promoCode) {
      return;
    }
    try {
      setPromoLoading(true);
      let { data } = await Api.getPromotion(promoCode);
      setPromoData(data);
    } catch (e) {
      setPromoData({ valid: false, message: "Invalid promo code" });
    } finally {
      setPromoLoading(false);
    }
  };

  const clearPromoCode = () => {
    setPromoData(null);
    setPromoCode(null);
  };

  const renderSummaryCard = () => {
    // Get plan total
    let planAmount = (foundPlanObj?.amount ?? 0) / 100;
    if (
      promoData?.valid &&
      promoData?.percentOff &&
      foundPlanObj &&
      promoData?.appliesTo?.includes(foundPlanObj.stripe_product_id)
    ) {
      planAmount = planAmount * (1 - promoData.percentOff / 100);
    }
    // Get add-on total
    let addonAmount = 0;
    for (const businessAccountAddonId of props.formState
      ?.businessAccountAddonIds) {
      let addonObj = props.formState.addonData.find(
        (x) => x.business_account_addon_id === businessAccountAddonId,
      );
      if (!addonObj) {
        continue;
      }
      const addonPrice = getAddonPrice(addonObj);
      let discountedAddonPrice = addonPrice;
      if (
        promoData?.valid &&
        promoData?.percentOff &&
        promoData?.appliesTo?.includes(addonObj.stripe_product_id)
      ) {
        discountedAddonPrice = addonPrice * (1 - promoData.percentOff / 100);
      }
      addonAmount += discountedAddonPrice;
    }
    // Aggregate plan and add-on totals
    let totalAmount = planAmount;
    if (addonAmount > 0) {
      totalAmount += addonAmount;
    }
    return (
      <div className={classes.planSummaryContainer}>
        {planAmount ? (
          <div className={classes.planSummaryItem}>
            <span className={classes.planSummaryLabel}>Subscription</span>
            <span>
              £
              {Number.isInteger(planAmount)
                ? Number(planAmount)
                : Number(planAmount).toFixed(2)}
              /month
            </span>
          </div>
        ) : null}
        {addonAmount ? (
          <div className={classes.planSummaryItem}>
            <span className={classes.planSummaryLabel}>Add-ons</span>
            <span>
              £
              {Number.isInteger(addonAmount)
                ? Number(addonAmount)
                : Number(addonAmount).toFixed(2)}
            </span>
          </div>
        ) : null}
        <div
          className={classNames(
            classes.planSummaryItem,
            classes.planSummaryTotal,
          )}
        >
          <span className={classes.planSummaryLabel}>Total</span>
          <div className={classes.sharedFlexRow}>
            <span>£</span>
            {/* {AnimatedNumbersComponent ? (
                <AnimatedNumbersComponent
                  includeComma
                  animateToNumber={Math.round(totalAmount * 100) / 100}
                />
              ) : ( */}
            <span className={classes.paymentSummaryAmountFallback}>
              {Number.isInteger(totalAmount)
                ? Number(totalAmount)
                : Number(totalAmount).toFixed(2)}
            </span>
            {/* )} */}
          </div>
        </div>
      </div>
    );
  };

  const renderPromoLottie = () => {
    // if (!LottieComponent) {
    //   return null;
    // }
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: appliedCheckData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div className={classes.paymentPromoLottieWrapper}>
        {/* <LottieComponent options={defaultOptions} width={50} /> */}
      </div>
    );
  };

  const renderPromoInput = () => {
    if (promoData?.valid) {
      return (
        <div className={classes.appliedPromoContainer}>
          <div className={classes.sharedFlexRow}>
            {renderPromoLottie()}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div
              //className={classes.appliedPromoTitle}
              >
                {promoCode}
              </div>
              <div className={classes.appliedPromoSubtitle}>Promo applied</div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <IconButton
              color="error"
              disabled={props.formState.createAccountLoading}
              onClick={() => clearPromoCode()}
            >
              <Close />
            </IconButton>
          </motion.div>
        </div>
      );
    }
    return (
      <TextField
        label="Promo Code"
        value={promoCode ? promoCode : ""}
        disabled={promoLoading || props.formState.createAccountLoading}
        error={promoData?.valid === false}
        helperText={promoData?.valid === false ? promoData?.message : undefined}
        variant="outlined"
        className={classes.formInput}
        onChange={(e) => setPromoCode(e.target.value)}
        fullWidth
        InputProps={{
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              {promoLoading ? (
                <CircularProgress color="secondary" size={20} />
              ) : (
                <Button
                  aria-label="Apply promo code"
                  disabled={props.formState.createAccountLoading}
                  onClick={() => applyPromoCode()}
                  style={{ fontWeight: "400" }}
                >
                  APPLY
                </Button>
              )}
            </InputAdornment>
          ),
        }}
      />
    );
  };

  const handleCardElementChange = (e: StripeCardElementChangeEvent) => {
    // Handle input error
    if (e.error) {
      setCardElementError(e.error.message);
    } else {
      setCardElementError(null);
    }
    // Handle input complete
    if (e.complete !== cardElementComplete) {
      setCardElementComplete(e.complete);
    }
  };

  const createAccount = async () => {
    if (props.formState?.createAccountLoading === true) {
      return;
    }
    if (!stripe || !elements) {
      return;
    }
    if (!cardElementComplete && !cardElementError) {
      setCardElementError("Payment details are required");
    }
    if (cardElementError || !cardElementComplete) {
      return;
    }
    setCreateAccountError(null);
    props.handleChange("createAccountLoading", true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    cardElement.update({ disabled: true });
    try {
      const { data: responseData } = await Api.createPaymentIntent({
        firstname: props.formState.firstname,
        lastname: props.formState.lastname,
        business_name: props.formState.businessName,
        email: props.formState.email,
        password: props.formState.password,
        business_account_type_id: props.formState.businessAccountTypeId,
        business_account_addon_ids: props.formState.businessAccountAddonIds,
        promo_code: promoData?.valid === true ? promoCode : null,
      });
      const paymentResult = await stripe.confirmCardPayment(
        responseData.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: `${props.formState.firstname} ${props.formState.lastname}`,
              email: props.formState.email,
            },
          },
          setup_future_usage: "off_session",
        },
      );
      if (paymentResult.error) {
        setCreateAccountError(paymentResult.error.message ?? "Payment failed");
      } else {
        let successStatuses = ["succeeded", "processing"];
        if (successStatuses.includes(paymentResult.paymentIntent.status)) {
          // Show success window
          props.handleChange("formComplete", true);
        }
      }
    } catch (e) {
      setCreateAccountError(
        "An error occurred and we were unable to create your account.",
      );
    } finally {
      props.handleChange("createAccountLoading", false);
      cardElement.update({ disabled: false });
    }
  };

  return (
    <AnimatePresence>
      {props.isVisible && (
        <div className={classes.formSectionContainer}>
          <div className={classes.cartContainer}>
            {renderSubscription()}
            {props.formState.businessAccountAddonIds.map((x) => {
              return renderAddon(x);
            })}
          </div>
          {renderPromoInput()}
          {renderSummaryCard()}
          <div className={classes.cardElementContainer}>
            <div className={classes.cardElementTitle}>
              <span>Credit or debit card</span>
              <div className={classes.sharedFlexRow}>
                <div className={classes.cardElementLogo}>
                  <img
                    src="/img/payment-icons/visa.svg"
                    alt="Visa logo"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={classes.cardElementLogo}>
                  <img
                    src="/img/payment-icons/mastercard.svg"
                    alt="Mastercard logo"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className={classes.cardElementLogo}>
                  <img
                    src="/img/payment-icons/amex.svg"
                    alt="American Express logo"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardElementChange}
            />
            {cardElementError && (
              <div className={classes.paymentCardErrorText}>
                {cardElementError}
              </div>
            )}
          </div>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            className={classes.formButton}
            onClick={() => createAccount()}
          >
            {props.formState?.createAccountLoading ? (
              <CircularProgress color="inherit" size={26} />
            ) : (
              "Create account"
            )}
          </Button>
          {createAccountError && (
            <div className={classes.errorContainer}>{createAccountError}</div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
