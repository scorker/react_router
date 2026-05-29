import { IconButton, LinearProgress } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Intercom } from "@intercom/messenger-js-sdk";
import { Elements } from "@stripe/react-stripe-js";
import { withStyles } from "@mui/styles";
import { getStripe } from "../../utilities/stripe";
import Api from "../../api/index";
import { motion } from "framer-motion";
import DetailsPage from "../pages-sections/signup/DetailsPage";
import PlanPage from "../pages-sections/signup/PlanPage";
import AddonsPage from "../pages-sections/signup/AddonsPage";
import PaymentPage from "../pages-sections/signup/PaymentPage";
import stylerLogoSecondary from "../assets/styler_logo_secondary.svg";
import PresentationSlide from "../../components/SignUp/PresentationSlide";
import SuccessOverlay from "../../components/SignUp/SuccessOverlay";
import signupPageStyle from "../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";
import { getStoredReferralPromoCode } from "../referral/attributionCookie";

const backButtonSx = {
  color: "inherit",
};

const backButton: React.CSSProperties = {
  position: "absolute",
  marginTop: "-2px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SignUp = (props: any) => {
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof getStripe
  > | null>(null);
  const [formPage, setFormPage] = useState(-1);
  const [subTitleTransition, setSubTitleTransition] = useState(true);
  const [firstname, setFirstname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [addonData, setAddonData] = useState<any>(null);
  const [businessAccountTypeId, setBusinessAccountTypeId] = useState<
    number | null
  >(null);
  const [businessAccountAddonIds, setBusinessAccountAddonIds] = useState<
    number[]
  >([]);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [referredPromoCode, setReferredPromoCode] = useState<string | null>(
    null,
  );

  const formState = {
    stripePromise,
    formPage,
    subTitleTransition,
    firstname,
    lastname,
    businessName,
    email,
    password,
    termsAgreed,
    planData,
    addonData,
    businessAccountTypeId,
    businessAccountAddonIds,
    createAccountLoading,
    formComplete,
  };

  useEffect(() => {
    setFormPage(0);
    // Init intercom
    Intercom({ app_id: "u8n0vv7y" });
    setReferredPromoCode(getStoredReferralPromoCode());
  }, []);

  const changePageViaProgressBar = (page: number) => {
    if (page > formPage) {
      return;
    }
    changePage(page);
  };

  const changePage = async (page: number) => {
    if (page < 0 || page > 3 || page === formPage || createAccountLoading) {
      return;
    }
    if (page === 1) {
      // Load plan prices and availability
      getPlanData();
    }
    if (page === 2) {
      // Load addon prices and availability
      getAddonData();
    }
    if (page === 3 && !stripePromise) {
      setStripePromise(getStripe());
    }
    setSubTitleTransition(!subTitleTransition);
    setTimeout(() => {
      setSubTitleTransition(true);
      setFormPage(page);
    }, 400);
  };

  const removeSubscription = () => {
    setFormPage(1);
    setBusinessAccountTypeId(null);
    setBusinessAccountAddonIds([]);
  };

  const removeAddon = (businessAccountAddonId: number) => {
    if (businessAccountAddonIds.includes(businessAccountAddonId)) {
      let localBusinessAccountAddonIds = [...businessAccountAddonIds];
      localBusinessAccountAddonIds = localBusinessAccountAddonIds.filter(
        (x) => x !== businessAccountAddonId,
      );
      setBusinessAccountAddonIds(localBusinessAccountAddonIds);
    }
  };

  const getPlanData = async () => {
    if (!planData) {
      let response = await Api.getPlans();
      setPlanData(response.data.planData);
    }
  };

  const getAddonData = async () => {
    if (!addonData) {
      let response = await Api.getAddons();
      setAddonData(response.data.addonData);
    }
  };

  const handleChange = (name: string, value: any) => {
    switch (name) {
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "businessName":
        setBusinessName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "termsAgreed":
        setTermsAgreed(value);
        break;
      case "planData":
        setPlanData(value);
        break;
      case "addonData":
        setAddonData(value);
        break;
      case "businessAccountTypeId":
        setBusinessAccountTypeId(value);
        break;
      case "businessAccountAddonIds":
        setBusinessAccountAddonIds(value);
        break;
      case "createAccountLoading":
        setCreateAccountLoading(value);
        break;
      case "formComplete":
        setFormComplete(value);
        break;
      default:
        break;
    }
  };

  const renderSubTitle = () => {
    let subTitle = "Let's get started";
    switch (formPage) {
      case -1:
      case 0:
        subTitle = "Let's get started";
        break;
      case 1:
        subTitle = "Select a plan";
        break;
      case 2:
        subTitle = "Add-ons";
        break;
      case 3:
        subTitle = "Payment details";
        break;
    }
    const words: string[][] = [];
    for (const [, item] of subTitle.split(" ").entries()) {
      words.push(item.split(""));
    }
    words.map((word, wordIdx) => {
      if (wordIdx !== words.length - 1) {
        return word.push("\u00A0");
      } else {
        return word;
      }
    });
    return (
      <motion.div
        style={{ display: "flex", justifyContent: "center" }}
        initial="hidden"
        animate={subTitleTransition ? "visible" : "hidden"}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.025,
            },
          },
        }}
      >
        {words.map((word, index) => {
          return (
            // Wrap each word in the Wrapper component
            <div key={index}>
              {words[index].flat().map((element: string, index: number) => {
                return (
                  <span
                    style={{
                      overflow: "hidden",
                      display: "inline-block",
                    }}
                    key={index}
                  >
                    <motion.span
                      style={{ display: "inline-block", lineHeight: "30px" }}
                      variants={{
                        hidden: {
                          y: "200%",
                          //color: primaryColor[0],
                          transition: {
                            ease: [0.455, 0.03, 0.515, 0.955],
                            duration: 0.85,
                          },
                        },
                        visible: {
                          y: 0,
                          //  color: primaryColor[0],
                          transition: {
                            ease: [0.455, 0.03, 0.515, 0.955],
                            duration: 0.75,
                          },
                        },
                      }}
                    >
                      {element}
                    </motion.span>
                  </span>
                );
              })}
            </div>
          );
        })}
      </motion.div>
    );
  };

  const renderFormPage = () => {
    return (
      <div style={{ width: "100%" }}>
        <DetailsPage
          handleChange={handleChange}
          changePage={changePage}
          inTransition={subTitleTransition}
          isVisible={formPage === 0 && subTitleTransition}
          formState={formState}
          classes={props.classes}
        />
        <PlanPage
          classes={props.classes}
          handleChange={handleChange}
          changePage={changePage}
          inTransition={subTitleTransition}
          isVisible={formPage === 1 && subTitleTransition}
          formState={formState}
        />
        <AddonsPage
          classes={props.classes}
          handleChange={handleChange}
          changePage={changePage}
          inTransition={subTitleTransition}
          isVisible={formPage === 2}
          formState={formState}
        />
        <Elements stripe={stripePromise}>
          {React.createElement(PaymentPage as any, {
            classes: props.classes,
            handleChange,
            changePage,
            inTransition: subTitleTransition,
            isVisible: formPage === 3,
            formState,
            removeSubscription,
            removeAddon,
          })}
        </Elements>
      </div>
    );
  };

  const renderBackButton = () => {
    return (
      <motion.div
        animate={formPage > 0 ? "visible" : "hidden"}
        initial={{ opacity: 0 }}
        variants={{
          hidden: {
            opacity: 0,
            transition: { duration: 0.5 },
          },
          visible: {
            opacity: 1,
            transition: { duration: 0.5 },
          },
        }}
      >
        <IconButton
          style={backButton}
          sx={backButtonSx}
          disabled={createAccountLoading}
          onClick={() => changePage(formPage - 1)}
        >
          <KeyboardBackspace />
        </IconButton>
      </motion.div>
    );
  };

  return (
    <div className={props.classes.pageContainer}>
      {formComplete && <SuccessOverlay firstname={firstname} />}
      <div className={props.classes.formContainer}>
        <div className={props.classes.formHeader}></div>
        <div className={props.classes.formBody}>
          <div className={props.classes.logoContainer}>
            <img
              src={stylerLogoSecondary}
              alt="Styler Logo"
              style={{ width: "min(220px, 56vw)", height: "auto" }}
            />
          </div>
          <div className={props.classes.formTitle}>
            {renderBackButton()}
            {renderSubTitle()}
            {referredPromoCode ? (
              <div className={props.classes.referralAttributionBadge}>
                Referred offer: {referredPromoCode}
              </div>
            ) : null}
          </div>
          <div className={props.classes.formProgressBarContainer}>
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => changePageViaProgressBar(0)}
            >
              <LinearProgress
                variant="determinate"
                value={100}
                className={props.classes.formProgressBar}
              />
            </div>
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => changePageViaProgressBar(1)}
            >
              <LinearProgress
                variant="determinate"
                value={formPage >= 1 ? 100 : 0}
                className={props.classes.formProgressBar}
              />
            </div>
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => changePageViaProgressBar(2)}
            >
              <LinearProgress
                variant="determinate"
                value={formPage >= 2 ? 100 : 0}
                className={props.classes.formProgressBar}
              />
            </div>
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => changePageViaProgressBar(3)}
            >
              <LinearProgress
                variant="determinate"
                value={formPage >= 3 ? 100 : 0}
                className={props.classes.formProgressBar}
              />
            </div>
          </div>
          {renderFormPage()}
        </div>
      </div>
      <PresentationSlide />
    </div>
  );
};

export default withStyles(() => signupPageStyle)(SignUp);
