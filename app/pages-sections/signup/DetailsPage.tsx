/*eslint-disable*/
import React, { useState } from "react";
// Framer motion
import { motion, AnimatePresence } from "framer-motion";
// API
import Api from "../../../api/index";
// @material-ui/core components
//import makeStyles from "@mui/styles/makeStyles";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  detailsFormSectionContainer,
  detailsNameInputContainer,
  detailsFormInput,
  detailsFormButton,
  detailsTermsLabel,
  detailsTermsLink,
} from "./signupStyles";

//import signupPageStyle from "../../../styles/jss/nextjs-material-kit-pro/pages/signupPageStyle.js";

type RequiredFieldKey =
  | "firstname"
  | "lastname"
  | "businessName"
  | "email"
  | "password"
  | "termsAgreed";

type DetailsFormState = {
  firstname: string | null;
  lastname: string | null;
  businessName: string | null;
  email: string | null;
  password: string | null;
  termsAgreed: boolean;
  [key: string]: any;
};

type DetailsPageProps = {
  formState: DetailsFormState;
  isVisible: boolean;
  inTransition?: boolean;
  handleChange: (name: string, value: any) => void;
  changePage: (page: number) => void;
};

type RequiredKeyMeta = {
  setError: (value: any) => void;
  error: boolean;
};

type RequiredKeyMap = Record<RequiredFieldKey, RequiredKeyMeta>;

//const useStyles = makeStyles(signupPageStyle as any);
const MotionDiv = motion.div as any;

const animationVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.2 },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.3 },
  },
};

export default function DetailsPage(props: DetailsPageProps) {
  //const classes = useStyles();
  const [formLoading, setFormLoading] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [businessNameError, setBusinessNameError] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<boolean | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const requiredKeyObj: RequiredKeyMap = {
    firstname: { setError: setFirstNameError, error: false },
    lastname: { setError: setLastNameError, error: false },
    businessName: { setError: setBusinessNameError, error: false },
    email: { setError: setEmailError, error: false },
    password: { setError: setPasswordError, error: false },
    termsAgreed: { setError: setTermsError, error: false },
  };
  const validateField = (
    fieldKey: RequiredFieldKey,
    fieldValue: any,
    requiredKeys: RequiredKeyMap,
  ) => {
    let valid = true;
    if (fieldKey === "termsAgreed") {
      setTermsError(fieldValue === false);
      return fieldValue === true;
    }
    if (requiredKeys[fieldKey] && (!fieldValue || fieldValue.length === 0)) {
      valid = false;
      if (["email", "password"].includes(fieldKey)) {
        let formattedKey = fieldKey[0].toUpperCase() + fieldKey.slice(1);
        requiredKeys[fieldKey].setError(formattedKey + " is required");
      } else {
        requiredKeys[fieldKey].setError(true);
      }
    } else {
      if (["email", "password"].includes(fieldKey)) {
        requiredKeys[fieldKey].setError(null);
      } else {
        requiredKeys[fieldKey].setError(false);
      }
    }
    if (fieldKey === "email" && valid) {
      let emailRe =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRe.test(String(fieldValue).toLowerCase())) {
        valid = false;
        requiredKeys.email.setError("Invalid email address");
      }
    }
    if (fieldKey === "password" && valid) {
      let passwordRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
      if (!passwordRe.test(String(fieldValue).toLowerCase())) {
        valid = false;
        requiredKeys.password.setError(
          "Password must be at least 8 characters and contain at least one number and letter",
        );
      }
    }
    return valid;
  };
  const nextPage = async () => {
    if (formLoading) {
      return;
    }
    // Check required
    setFormLoading(true);
    const requiredKeys: RequiredKeyMap = Object.assign({}, requiredKeyObj);
    Object.keys(requiredKeys).forEach((requiredKey) => {
      const typedRequiredKey = requiredKey as RequiredFieldKey;
      let keyValue = props.formState[typedRequiredKey];
      requiredKeys[typedRequiredKey].error = !validateField(
        typedRequiredKey,
        keyValue,
        requiredKeys,
      );
    });
    // Proceed if all are fields are valid
    if (
      !Object.keys(requiredKeys).find(
        (x) => requiredKeys[x as RequiredFieldKey].error === true,
      ) &&
      props.formState?.termsAgreed === true
    ) {
      let userExists = await checkUserExists();
      setFormLoading(false);
      if (userExists === true) {
        requiredKeys.email.setError("Email address already registered");
      } else {
        props.changePage(1);
      }
    } else {
      setFormLoading(false);
    }
  };
  const handleChange = (fieldKey: RequiredFieldKey, fieldValue: any) => {
    const requiredKeys: RequiredKeyMap = Object.assign({}, requiredKeyObj);
    validateField(fieldKey, fieldValue, requiredKeys);
    props.handleChange(fieldKey, fieldValue);
  };
  const checkUserExists = async () => {
    let response = await Api.postUserDetails({
      firstname: props?.formState.firstname,
      lastname: props?.formState.lastname,
      business_name: props?.formState.businessName,
      email: props?.formState.email,
    });
    return response.data.userExists;
  };
  return (
    <AnimatePresence>
      {props.isVisible && (
        <MotionDiv
          style={detailsFormSectionContainer}
          variants={animationVariants}
          initial={{ opacity: 0, y: 0 }}
          animate={"visible"}
          exit={"hidden"}
        >
          <div style={detailsNameInputContainer}>
            <TextField
              required
              label="First name"
              variant="outlined"
              style={detailsFormInput}
              onChange={(e) => handleChange("firstname", e.target.value)}
              autoComplete="given-name"
              value={
                props.formState?.firstname ? props.formState.firstname : ""
              }
              error={firstNameError}
              helperText={firstNameError ? "First name is required" : null}
              disabled={formLoading}
            />
            <TextField
              required
              label="Last name"
              variant="outlined"
              style={detailsFormInput}
              onChange={(e) => handleChange("lastname", e.target.value)}
              autoComplete="family-name"
              value={props.formState?.lastname ? props.formState.lastname : ""}
              error={lastNameError}
              helperText={lastNameError ? "Last name is required" : null}
              disabled={formLoading}
            />
          </div>
          <TextField
            required
            label="Business name"
            variant="outlined"
            style={detailsFormInput}
            onChange={(e) => handleChange("businessName", e.target.value)}
            autoComplete="organization"
            value={
              props.formState?.businessName ? props.formState.businessName : ""
            }
            error={businessNameError}
            helperText={businessNameError ? "Business name is required" : null}
            disabled={formLoading}
          />
          <TextField
            required
            label="Email"
            variant="outlined"
            style={detailsFormInput}
            type="email"
            onChange={(e) => handleChange("email", e.target.value)}
            autoComplete="email"
            value={props.formState?.email ? props.formState.email : ""}
            error={emailError !== null}
            helperText={emailError ? emailError : null}
            disabled={formLoading}
          />
          <TextField
            required
            label="Password"
            variant="outlined"
            style={detailsFormInput}
            type={passwordVisible ? "text" : "password"}
            onChange={(e) => handleChange("password", e.target.value)}
            autoComplete="new-password"
            value={props.formState?.password ? props.formState.password : ""}
            error={passwordError !== null}
            helperText={passwordError ? passwordError : null}
            disabled={formLoading}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div
            //className={classes.termsContainer}
            style={
              termsError === true
                ? {
                    border: "1px solid #ff2b54",
                    borderRadius: 4,
                    marginBottom: "1.5em",
                  }
                : { marginBottom: "1.5em" }
            }
          >
            <FormControlLabel
              style={detailsTermsLabel}
              //className={classes.termsLabel}
              control={
                <Checkbox
                  required
                  checked={props.formState?.termsAgreed}
                  onChange={(e) =>
                    handleChange("termsAgreed", e.target.checked)
                  }
                  inputProps={{ "aria-label": "controlled" }}
                  disabled={formLoading}
                />
              }
              label={
                <span>
                  I agree to the{" "}
                  <Link
                    style={detailsTermsLink}
                    //className={classes.termsLink}
                    href="https://help.whatstyle.uk/legal/terms_of_business"
                    target="_blank"
                    rel="noopener"
                  >
                    Terms Of Business
                  </Link>
                  {", "}
                  <Link
                    style={detailsTermsLink}
                    href="https://help.whatstyle.uk/legal/terms_of_use"
                    target="_blank"
                    rel="noopener"
                  >
                    Terms Of Use
                  </Link>
                  {" and "}
                  <Link
                    style={detailsTermsLink}
                    href="https://help.whatstyle.uk/legal/privacy_policy"
                    target="_blank"
                    rel="noopener"
                  >
                    Privacy Policy
                  </Link>
                  {"."}
                </span>
              }
            />
          </div>
          <Button
            variant="contained"
            size="large"
            color="primary"
            style={detailsFormButton}
            //className={classes.formButton}
            onClick={() => nextPage()}
          >
            {formLoading ? (
              <CircularProgress color="inherit" size={26} />
            ) : (
              "Next"
            )}
          </Button>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
