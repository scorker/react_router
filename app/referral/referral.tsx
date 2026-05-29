import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
import stylerLogoSecondary from "../assets/styler_logo_secondary.svg";
import signupPageStyle from "../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { getPromoCodeFromSearch } from "./attributionCookie";

const ReferralPage = (props: any) => {
  const { search } = useLocation();
  const [user_name, setUserName] = useState("Scott Corker");
  const [business_name, setBusinessName] = useState("MyWareDesign");
  const business_promo_code = getPromoCodeFromSearch(search);
  const signupLink = business_promo_code
    ? `/?promo=${encodeURIComponent(business_promo_code)}`
    : "/";

  return (
    <div className={props.classes.pageContainer}>
      <div className={props.classes.formContainer}>
        <div className={props.classes.logoContainer}>
          <img
            src={stylerLogoSecondary}
            alt="Styler Logo"
            style={{ width: "min(220px, 56vw)", height: "auto" }}
          />
        </div>
        <div className={props.classes.formHeader}>
          <h2 className={props.classes.formTitle}>
            {`${user_name} from ${business_name} uses Styler. Try it with 50% off
            for 3 months.`}
          </h2>
        </div>
        {business_promo_code ? (
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <p className={props.classes.formText}>
              Referral offer code: {business_promo_code}
            </p>
          </div>
        ) : null}
        <div className={props.classes.formBody}>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>advocate context</p>
          </div>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>product value props</p>
          </div>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>signup CTA</p>
            <Button
              component={Link}
              to={signupLink}
              variant="contained"
              color="secondary"
              className={props.classes.formButton}
            >
              Start your signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(() => signupPageStyle)(ReferralPage);
