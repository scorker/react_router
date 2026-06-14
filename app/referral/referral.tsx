import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
import stylerLogoSecondary from "../assets/styler_logo_secondary.svg";
import signupPageStyle from "../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { getPromoCodeFromSearch } from "./attributionCookie";
import Api from "../../api/index";

const ReferralPage = (props: any) => {
  const { search } = useLocation();
  const [promotionData, setPromotionData] = useState<any>(null);
  const business_promo_code = getPromoCodeFromSearch(search);
  const signupLink = business_promo_code
    ? `/?promo=${encodeURIComponent(business_promo_code)}`
    : "/";

  useEffect(() => {
    const fetchPromotion = async () => {
      if (!business_promo_code) {
        return;
      }
      const { data } = await Api.getPromotionDetails(business_promo_code);
      setPromotionData(data);
    };
    fetchPromotion();
  }, [business_promo_code]);

  return (
    <div
      className={props.classes.pageContainer}
      style={
        promotionData && promotionData.business_img
          ? {
              backgroundImage: `url(https://cdn.whatstyle.com/${promotionData.business_img.trim()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
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
            {promotionData &&
              `${promotionData.business_user_firstname} ${promotionData.business_user_lastname} from ${promotionData.business_name} uses Styler. Try it with 50% off
            for 3 months.`}
          </h2>
        </div>

        <div className={props.classes.formBody}>
          <div className={props.classes.formGroup}>
            <p
              className={`${props.classes.formText} ${props.classes.formTextPara}`}
            >
              {promotionData &&
                promotionData.business_slug &&
                `Hi from ${promotionData.business_slug}, we are pleased your are interested in trying Styler.`}
            </p>
            <p
              className={`${props.classes.formText} ${props.classes.formTextPara}`}
            >
              {promotionData &&
                promotionData.description &&
                promotionData.description}
            </p>
            <p
              className={`${props.classes.formText} ${props.classes.formTextPara}`}
            >
              {promotionData &&
                `We are located at ${promotionData.address_unit_name ? promotionData.address_unit_name : ""}, 
                ${promotionData.address_street ? promotionData.address_street : ""}, 
                ${promotionData.address_city ? promotionData.address_city : ""}, 
                ${promotionData.address_state ? promotionData.address_state : ""} 
                ${promotionData.address_zipcode ? promotionData.address_zipcode : ""}`}
            </p>
          </div>
          <div className={props.classes.formGroup}>
            <p className={props.classes.formSubtitle}>
              {`We are offering you a special promotion with code ${business_promo_code} to get started.  The products on promotion are
              the following:`}
            </p>
            {promotionData && promotionData.appliesTo.length > 0 ? (
              <ul className={props.classes.valuePropList}>
                {promotionData.appliesTo.map(
                  (feature: string, index: number) => (
                    <li key={index} className={props.classes.valuePropItem}>
                      {feature}
                    </li>
                  ),
                )}
              </ul>
            ) : null}
          </div>
          <div className={props.classes.formCTA}>
            <Button
              component={Link}
              to={signupLink}
              variant="contained"
              color="secondary"
              className={props.classes.signUpButton}
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
