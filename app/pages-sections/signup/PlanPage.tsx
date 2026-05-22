/*eslint-disable*/
import React from "react";
// Framer motion
import { motion, AnimatePresence } from "framer-motion";
// @material-ui/core components
//import makeStyles from "@mui/styles/makeStyles";
import { Button, CircularProgress } from "@mui/material";
import { ArrowRightAlt, Check } from "@mui/icons-material";
// API
import Api from "../../../api/index";
import {
  planOptionCardContainer,
  planOptionContainer,
  planOptionBody,
  planOptionTitle,
  planOptionDescription,
  planOptionFooter,
  planOptionPrice,
  pricingCurrency,
  pricingFrequency,
  formSectionContainer,
} from "./signupStyles";

// import {
//   primaryColor,
//   secondaryColor,
//   whiteColor,
// } from "../../../styles/jss/nextjs-material-kit-pro";
//import signupPageStyle from "../../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";

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
  formState: FormState;
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

export default function PlanPage(props: PlanPageProps) {
  //const classes = useStyles();
  const getPlanPrice = (business_account_type_id: number) => {
    if (props.formState?.planData) {
      const foundPlanObj = props.formState.planData.find(
        (x) => x.business_account_type_id === business_account_type_id,
      );
      if (!foundPlanObj) {
        return (
          <CircularProgress
            color={business_account_type_id === 1 ? "secondary" : "primary"}
            size={25}
          />
        );
      }
      return Number(foundPlanObj.amount / 100);
    } else {
      return (
        <CircularProgress
          color={business_account_type_id === 1 ? "secondary" : "primary"}
          size={25}
        />
      );
    }
  };
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
        //className={classes.planOptionContainer}
        style={{
          ...planOptionContainer,
          ...(isHighlighted
            ? { backgroundColor: "#000000" }
            : { backgroundColor: "#FFFFFF" }),
        }}
        variants={childVariants}
      >
        <div
          style={planOptionBody} //className={classes.planOptionBody}
        >
          <div
            //className={classes.planOptionTitle}
            style={{
              ...planOptionTitle,
              ...(isHighlighted ? { color: "#FFFFFF" } : undefined),
            }}
          >
            {planTitle}
          </div>
          <p
            style={planOptionDescription} //className={classes.planOptionDescription}
          >
            {planDescription}
          </p>
          {planObj?.active === false && (
            <p
              style={{
                ...planOptionDescription,
                color: "#FF0000",
                fontWeight: "500",
              }}
              //className={classes.planOptionDescription}
            >
              Currently unavailable
            </p>
          )}
        </div>
        <div
          //className={classes.planOptionFooter}
          style={{
            ...planOptionFooter,
            ...(isHighlighted ? { backgroundColor: "#000000" } : undefined),
          }}
        >
          <div
            //className={classes.planOptionPrice}
            style={{
              ...planOptionPrice,
              ...(isHighlighted ? { color: "#FFFFFF" } : undefined),
            }}
          >
            <span
              //className={classes.pricingCurrency}
              style={{
                ...pricingCurrency,
                ...(isHighlighted ? { color: "#FFFFFF" } : undefined),
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
              //className={classes.pricingFrequency}
              style={{
                ...pricingFrequency,
                ...(isHighlighted ? { color: "#FFFFFF" } : undefined),
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
          //className={classes.formSectionContainer}
          style={formSectionContainer}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
        >
          {renderPlanOption(1)}
          {renderPlanOption(3)}
          {renderPlanOption(2)}
          {/*<motion.div
                        className={classes.planOptionContainer}
                        style={{ backgroundColor: primaryColor[0] }}
                        variants={childVariants}
                    >
                        <div className={classes.planOptionBody}>
                            <div className={classes.planOptionTitle} style={{ color: whiteColor }}>App & Booking</div>
                            <p className={classes.planOptionDescription}>
                                Your own iOS & Android app with our full suite of booking tools integrated.
                            </p>
                        </div>
                        <div className={classes.planOptionFooter} style={{ backgroundColor: primaryColor[1] }}>
                            <div className={classes.planOptionPrice} style={{ color: whiteColor }}>
                                <span className={classes.pricingCurrency} style={{ color: whiteColor }}>£</span>
                                {getPlanPrice(1)}
                                <span className={classes.pricingFrequency} style={{ color: whiteColor }}>/month</span>
                            </div>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={!props.formState?.planData?.find(x => x.business_account_type_id === 1)?.active}
                                onClick={() => nextPage(1)}
                            >
                                {props.formState.businessAccountTypeId === 1 ? <Check/> : <ArrowRightAlt/>}
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div
                        className={classes.planOptionContainer}
                        style={{ backgroundColor: '#FFFFFF' }}
                        variants={childVariants}
                    >
                        <div className={classes.planOptionBody}>
                            <div className={classes.planOptionTitle}>App</div>
                            <p className={classes.planOptionDescription}>
                                Your own iOS and Android app <span style={{ fontWeight: '600' }}>with another booking system integrated</span>.
                            </p>
                        </div>
                        <div className={classes.planOptionFooter}>
                            <div className={classes.planOptionPrice}>
                                <span className={classes.pricingCurrency}>£</span>
                                {getPlanPrice(3)}
                                <span className={classes.pricingFrequency}>/month</span>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!props.formState?.planData?.find(x => x.business_account_type_id === 3)?.active}
                                onClick={() => nextPage(3)}
                            >
                                {props.formState.businessAccountTypeId === 3 ? <Check/> : <ArrowRightAlt/>}
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div
                        className={classes.planOptionContainer}
                        style={{ backgroundColor: '#FFFFFF' }}
                        variants={childVariants}
                    >
                        <div className={classes.planOptionBody}>
                            <div className={classes.planOptionTitle}>Booking</div>
                            <p className={classes.planOptionDescription}>
                                Your own branded booking system with everything you need to grow.
                            </p>
                        </div>
                        <div className={classes.planOptionFooter}>
                            <div className={classes.planOptionPrice}>
                                <span className={classes.pricingCurrency}>£</span>
                                {getPlanPrice(2)}
                                <span className={classes.pricingFrequency}>/month</span>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!props.formState?.planData?.find(x => x.business_account_type_id === 2)?.active}
                                onClick={() => nextPage(2)}
                            >
                                {props.formState.businessAccountTypeId === 2 ? <Check/> : <ArrowRightAlt/>}
                            </Button>
                        </div>
                    </motion.div>*/}
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
