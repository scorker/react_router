import { withStyles } from "@mui/styles";
import stylerLogoSecondary from "../assets/styler_logo_secondary.svg";
import signupPageStyle from "../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const ReferralPage = (props: any) => {
  const { search } = useLocation();
  const [user_name, setUserName] = useState("Scott Corker");
  const [business_name, setBusinessName] = useState("MyWareDesign");
  const query = new URLSearchParams(search);
  const business_promo_code = query.get("promo");

  useEffect(() => {}, []);

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
        <div className={props.classes.formBody}>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>advocate context</p>
          </div>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>product value props</p>
          </div>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formText}>signup CTA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles(() => signupPageStyle)(ReferralPage);
