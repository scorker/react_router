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
  const [user_firstname, setUserFirstName] = useState("Scott");
  const [user_lastname, setUserLastName] = useState("Corker");
  const [business_name, setBusinessName] = useState("MyWareDesign");
  const [promotionData, setPromotionData] = useState<any>(null);
  const [businessImg, setBusinessImg] = useState<any>(null);
  const business_promo_code = getPromoCodeFromSearch(search);
  const businessBackgroundImage = businessImg
    ? `https://cdn.whatstyle.com/${businessImg.trim()}`
    : null;
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
      setUserFirstName(data.advocate_firstname);
      setUserLastName(data.advocate_lastname);
      setBusinessName(data.business_name);
      setBusinessImg(data.business_img);
    };
    fetchPromotion();
  }, [business_promo_code]);

  return (
    <div
      className={props.classes.pageContainer}
      style={
        businessBackgroundImage
          ? {
              backgroundImage: `url(${businessBackgroundImage})`,
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
            {`${user_firstname} ${user_lastname} from ${business_name} uses Styler. Try it with 50% off
            for 3 months.`}
          </h2>
        </div>
        {business_promo_code ? (
          <div className={props.classes.formGroup}>
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
            <p className={props.classes.formSubtitle}>Products</p>
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
