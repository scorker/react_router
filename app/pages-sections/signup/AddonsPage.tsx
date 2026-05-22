/*eslint-disable*/
import React from "react";
// Framer motion
import { motion, AnimatePresence } from "framer-motion";
// @material-ui/core components
//import makeStyles from "@mui/styles/makeStyles";
import { Checkbox, Button, CircularProgress } from "@mui/material";
import {
  addonsUnavailableText,
  addonsDeliveryEstimateText,
  addonsDeliveryUnavailableText,
  sharedFullWidth,
  addOnContainer,
  formSectionContainer,
  planOptionDescription,
  formButton,
} from "./signupStyles";

// import { secondaryColor } from "../../../styles/jss/nextjs-material-kit-pro";
// import signupPageStyle from "../../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle";

type AddonPriceData = {
  business_account_type_id: number;
  amount: number;
};

type AddonMetadata = {
  express_delivery_time?: string;
  standard_delivery_time?: string;
};

type AddonDataItem = {
  business_account_addon_id: number;
  priceData: AddonPriceData[];
  active: boolean;
  metadata?: AddonMetadata;
};

type AddonsFormState = {
  businessAccountTypeId: number | null;
  addonData: AddonDataItem[] | null;
  businessAccountAddonIds: number[];
};

type AddonsPageProps = {
  formState: AddonsFormState;
  isVisible: boolean;
  inTransition?: boolean;
  handleChange: (name: string, value: any) => void;
  changePage: (page: number) => void;
};

//const useStyles = makeStyles(signupPageStyle as any);
const MotionDiv = motion.div as any;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      ease: [0.455, 0.03, 0.515, 0.955],
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0 },
};

export default function AddonsPage(props: AddonsPageProps) {
  // const classes = useStyles();
  const getConsultantTitle = (): string | null => {
    switch (props.formState.businessAccountTypeId) {
      case 1:
        return "App & Booking";
      case 2:
        return "Booking";
      case 3:
        return "App";
      default:
        return null;
    }
  };
  const getAddonPrice = (
    business_account_addon_id: number,
  ): React.ReactNode => {
    if (props.formState?.addonData) {
      const foundAddonObj = props.formState.addonData.find(
        (x) => x.business_account_addon_id === business_account_addon_id,
      );
      if (!foundAddonObj) {
        return null;
      }
      if (foundAddonObj.priceData.length > 1) {
        const priceObj = foundAddonObj.priceData.find(
          (x) =>
            x.business_account_type_id ===
            props.formState.businessAccountTypeId,
        );
        if (!priceObj) {
          return null;
        }
        return "+ £" + Number(priceObj.amount / 100);
      } else if (foundAddonObj.priceData.length === 1) {
        return "+ £" + Number(foundAddonObj.priceData[0].amount / 100);
      } else {
        return null;
      }
    } else {
      return <CircularProgress color={"primary"} size={15.5} />;
    }
  };
  const isAddonEnabled = (businessAccountAddonId: number): boolean => {
    if (props.formState?.addonData) {
      let foundAddonObj = props.formState.addonData.find(
        (x) => x.business_account_addon_id === businessAccountAddonId,
      );
      if (foundAddonObj) {
        return foundAddonObj.active;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const getDeliveryMetadata = (
    deliveryType: "express" | "standard",
  ): string => {
    let addonObj = props.formState?.addonData?.find(
      (x) => x.business_account_addon_id === 2,
    );
    if (!addonObj) {
      return "--";
    }
    if (deliveryType === "express") {
      return addonObj.metadata?.express_delivery_time ?? "--";
    } else {
      return addonObj.metadata?.standard_delivery_time ?? "--";
    }
  };
  const handleAddonChange = (businessAccountAddonId: number) => {
    let businessAccountAddonIds = [...props.formState.businessAccountAddonIds];
    if (businessAccountAddonIds.includes(businessAccountAddonId)) {
      businessAccountAddonIds = businessAccountAddonIds.filter(
        (x) => x !== businessAccountAddonId,
      );
    } else {
      businessAccountAddonIds.push(businessAccountAddonId);
    }
    props.handleChange("businessAccountAddonIds", businessAccountAddonIds);
  };
  return (
    <AnimatePresence>
      {props.isVisible && (
        <MotionDiv
          style={formSectionContainer}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
        >
          <MotionDiv
            style={addOnContainer}
            //className={classes.addonContainer}
            variants={childVariants}
          >
            <div>
              <span>{getConsultantTitle()} Consultant</span>
              <span>
                Included <Checkbox disabled checked />
              </span>
            </div>
            <p>
              All the support you need with your own dedicated UK-based
              consultant. Your consultant will be on hand to help anytime.
              Whether it be during the setup process, or just to make sure
              you're making the best use of our tools.
            </p>
          </MotionDiv>
          {props.formState.businessAccountTypeId !== null &&
            [1, 3].includes(props.formState.businessAccountTypeId) && (
              <MotionDiv style={addOnContainer} variants={childVariants}>
                <div>
                  <span>App Design</span>
                  <span>
                    Included <Checkbox disabled checked />
                  </span>
                </div>
                <p>
                  Send your logo, colours and brand guidelines to your
                  consultant and we'll bring your app to life!
                </p>
              </MotionDiv>
            )}
          <MotionDiv style={addOnContainer} variants={childVariants}>
            <div>
              <span>Data Onboarding</span>
              <span>
                {getAddonPrice(1)}
                <Checkbox
                  color="secondary"
                  disabled={!isAddonEnabled(1)}
                  onChange={() => handleAddonChange(1)}
                  checked={props.formState.businessAccountAddonIds.includes(1)}
                />
              </span>
            </div>
            {!isAddonEnabled(1) && (
              <p
                //className={classes.planOptionDescription}
                style={addonsUnavailableText}
              >
                Currently unavailable due to high demand
              </p>
            )}
            <p>
              Really busy? Your consultant can onboard your business, service
              and staff information for you.
            </p>
          </MotionDiv>
          {props.formState.businessAccountTypeId !== null &&
            [1, 3].includes(props.formState.businessAccountTypeId) && (
              <MotionDiv style={addOnContainer} variants={childVariants}>
                <div>App Setup</div>
                <p>
                  In a rush to get your app live on the App Stores? With Express
                  App Setup, we'll put your app in our priority queue for
                  deployment.
                </p>
                <div>
                  <span style={{ fontWeight: "500" }}>Standard</span>
                  <span>
                    Included <Checkbox color="secondary" checked disabled />
                  </span>
                </div>
                <p style={addonsDeliveryEstimateText}>
                  Est. {getDeliveryMetadata("standard")}
                </p>
                <div>
                  <span style={{ fontWeight: "500" }}>Express</span>
                  <span>
                    {getAddonPrice(2)}
                    <Checkbox
                      color="secondary"
                      disabled={!isAddonEnabled(2)}
                      onChange={() => handleAddonChange(2)}
                      checked={props.formState.businessAccountAddonIds.includes(
                        2,
                      )}
                    />
                  </span>
                </div>
                <p style={addonsDeliveryEstimateText}>
                  Est. {getDeliveryMetadata("express")}
                </p>
                {!isAddonEnabled(2) && (
                  <p
                    //className={classes.planOptionDescription}
                    style={{
                      ...planOptionDescription,
                      ...addonsDeliveryUnavailableText,
                    }}
                  >
                    Currently unavailable due to high demand
                  </p>
                )}
              </MotionDiv>
            )}
          <MotionDiv variants={childVariants} style={sharedFullWidth}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              //className={classes.formButton}
              style={formButton}
              onClick={() => props.changePage(3)}
            >
              Next
            </Button>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
