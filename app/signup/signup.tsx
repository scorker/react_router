import { IconButton, LinearProgress } from "@mui/material";
import { KeyboardBackspace } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
//import Intercom from "@intercom/messenger-js-sdk";
import { Elements } from "@stripe/react-stripe-js";
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

const backButtonSx = {
  color: "inherit",
};

const progressBarTrackStyle: React.CSSProperties = {
  width: "100%",
  height: "8px",
  borderRadius: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
};

const pageShellStyle: React.CSSProperties = {
  // minHeight: "100dvh",
  display: "flex",
};

const pageContentStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  justifyContent: "space-evenly",
  padding: "clamp(12px, 2.5vw, 28px)",
  overflowY: "auto",
  width: "100%",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "15px",
  paddingRight: "15px",
  flexDirection: "column",
  gap: "clamp(12px, 3vh, 32px)",
};

const formContainerStyle: React.CSSProperties = {
  gap: "14px",
  width: "100%",
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "15px",
  paddingRight: "15px",
  flexDirection: "column",
};

const formTitle: React.CSSProperties = {
  color: "#0a122b",
  width: "100%",
  position: "relative",
  fontSize: "1.7em",
  fontWeight: 600,
  marginBottom: "1em",
};

const backButton: React.CSSProperties = {
  position: "absolute",
  marginTop: "-2px",
};

export function SignUp() {
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
    // Intercom({ app_id: "u8n0vv7y" });
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
        />
        <PlanPage
          handleChange={handleChange}
          changePage={changePage}
          inTransition={subTitleTransition}
          isVisible={formPage === 1 && subTitleTransition}
          formState={formState}
        />
        <AddonsPage
          handleChange={handleChange}
          changePage={changePage}
          inTransition={subTitleTransition}
          isVisible={formPage === 2}
          formState={formState}
        />
        <Elements stripe={stripePromise}>
          {React.createElement(PaymentPage as any, {
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

  const renderProgressBar = (value: number, page: number) => {
    return (
      <div
        style={{ flex: 1, minWidth: 0, width: "100%", cursor: "pointer" }}
        onClick={() => changePageViaProgressBar(page)}
      >
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            ...progressBarTrackStyle,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#ff2b54",
              transition: "transform .1s linear",
              borderRadius: "20px",
            },
          }}
        />
      </div>
    );
  };

  return (
    <div style={pageShellStyle}>
      {formComplete && <SuccessOverlay firstname={firstname} />}
      <div style={pageContentStyle}>
        <div style={formContainerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <img
              src={stylerLogoSecondary}
              alt="Styler Logo"
              style={{ width: "min(220px, 56vw)", height: "auto" }}
            />
          </div>
          <div style={formTitle}>
            {renderBackButton()}
            {renderSubTitle()}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 8,
            }}
          >
            {renderProgressBar(100, 0)}
            {renderProgressBar(formPage >= 1 ? 100 : 0, 1)}
            {renderProgressBar(formPage >= 2 ? 100 : 0, 2)}
            {renderProgressBar(formPage >= 3 ? 100 : 0, 3)}
          </div>
          {renderFormPage()}
        </div>
      </div>
      <PresentationSlide />
    </div>
  );
}
