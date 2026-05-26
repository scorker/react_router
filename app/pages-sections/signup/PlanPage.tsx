/*eslint-disable*/
import React from "react";
// Framer motion
import { motion, AnimatePresence } from "framer-motion";
import { Button, CircularProgress } from "@mui/material";
import { ArrowRightAlt, Check } from "@mui/icons-material";
// API
import Api from "../../../api/index";

import {
  primaryColor,
  secondaryColor,
  whiteColor,
} from "../../../styles/jss/nextjs-material-kit-pro.js";

type PlanDataItem = {
  business_account_type_id: number;
  amount: number;
  active: boolean;
};

type FormState = {
  email: string | null;
  businessName: string | null;
  businessAccountTypeId: number | null;
  planData: PlanDataItem[] | null;
};

type PlanPageProps = {
  classes: Record<string, string>;
  formState: FormState;
  isVisible: boolean;
  inTransition?: boolean;
  handleChange: (name: string, value: any) => void;
  changePage: (page: number) => void;
};

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

export default function PlanPage(props: PlanPageProps) {
  const classes = props.classes;

  const nextPage = (business_account_type_id: number) => {
    try {
      Api.postUserPlan({
        email: props.formState.email,
        business_name: props.formState.businessName,
        business_account_type_id,
      });
    } catch (e) {
      console.log("Unable to log user plan");
    }
    props.handleChange("businessAccountTypeId", business_account_type_id);
    props.changePage(2);
  };
  const renderPlanOption = (businessAccountTypeId: number) => {
    const isHighlighted = businessAccountTypeId === 1;
    const planObj = props.formState.planData?.find(
      (x) => x.business_account_type_id === businessAccountTypeId,
    );
    let planTitle: string;
    let planDescription: React.ReactNode;
    switch (businessAccountTypeId) {
      case 1:
        planTitle = "App & Booking";
        planDescription =
          "Your own iOS & Android app with our full suite of booking tools integrated.";
        break;
      case 2:
        planTitle = "Booking";
        planDescription =
          "Your own branded booking system with everything you need to grow.";
        break;
      case 3:
        planTitle = "App";
        planDescription = (
          <span>
            Your own iOS and Android app{" "}
            <span style={{ fontWeight: "600" }}>
              with another booking system integrated
            </span>
            .
          </span>
        );
        break;
      default:
        return null;
    }
    return (
      <MotionDiv
        className={classes.planOptionContainer}
        style={{
          ...(isHighlighted
            ? { backgroundColor: primaryColor[0] }
            : { backgroundColor: "#FFFFFF" }),
        }}
        variants={childVariants}
      >
        <div className={classes.planOptionBody}>
          <div
            className={classes.planOptionTitle}
            style={{
              ...(isHighlighted ? { color: whiteColor } : undefined),
            }}
          >
            {planTitle}
          </div>
          <p className={classes.planOptionDescription}>{planDescription}</p>
          {planObj?.active === false && (
            <p
              style={{
                color: secondaryColor[0],
                fontWeight: "500",
              }}
              className={classes.planOptionDescription}
            >
              Currently unavailable
            </p>
          )}
        </div>
        <div
          className={classes.planOptionFooter}
          style={{
            ...(isHighlighted ? { backgroundColor: primaryColor[1] } : null),
          }}
        >
          <div
            className={classes.planOptionPrice}
            style={{
              ...(isHighlighted ? { color: whiteColor } : null),
            }}
          >
            <span
              className={classes.pricingCurrency}
              style={{
                ...(isHighlighted ? { color: whiteColor } : null),
              }}
            >
              £
            </span>
            {planObj ? (
              Number(planObj.amount / 100)
            ) : (
              <CircularProgress
                color={isHighlighted ? "secondary" : "primary"}
                size={25}
              />
            )}
            <span
              className={classes.pricingFrequency}
              style={{
                ...(isHighlighted ? { color: whiteColor } : null),
              }}
            >
              /month
            </span>
          </div>
          <Button
            variant="contained"
            color={isHighlighted ? "secondary" : "primary"}
            disabled={planObj ? !planObj.active : true}
            onClick={() => nextPage(businessAccountTypeId)}
          >
            {props.formState.businessAccountTypeId === businessAccountTypeId ? (
              <Check />
            ) : (
              <ArrowRightAlt />
            )}
          </Button>
        </div>
      </MotionDiv>
    );
  };
  return (
    <AnimatePresence>
      {props.isVisible && (
        <MotionDiv
          className={classes.formSectionContainer}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
        >
          {renderPlanOption(1)}
          {renderPlanOption(3)}
          {renderPlanOption(2)}
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
