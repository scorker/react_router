import React, { useEffect, useState } from "react";

import { withStyles } from "@mui/styles";
import { Button } from "@mui/material";
// Framer motion
import { motion } from "framer-motion";
// Lottie
import * as logoData from "../../lotties/logo.json";
// Stylesheet
// @ts-ignore - declaration shim not present for this JS style module
import styles from "../../styles/jss/nextjs-material-kit-pro/components/successOverlayStyle.js";

interface SuccessOverlayProps {
  classes: Record<string, string>;
  firstname?: string | null;
}

const SuccessOverlay = (props: SuccessOverlayProps) => {
  const { classes } = props;
  const [LottieComponent, setLottieComponent] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let isMounted = true;
    import("react-lottie")
      .then((module) => {
        const maybeDefault = (module as any)?.default;
        const resolvedComponent =
          (maybeDefault as any)?.default ?? maybeDefault ?? module;

        if (isMounted && typeof resolvedComponent === "function") {
          setLottieComponent(
            () => resolvedComponent as React.ComponentType<any>,
          );
        }
      })
      .catch(() => {
        // Keep animation hidden if import fails.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderLogoAnimation = () => {
    if (!LottieComponent) {
      return null;
    }
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: logoData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div style={{ height: 120, position: "relative" }}>
        <LottieComponent
          width={500}
          height={120}
          options={defaultOptions}
          style={{ position: "absolute", left: -150, right: -150 }}
        />
      </div>
    );
  };

  return (
    <motion.div
      className={classes.successOverlayContainer}
      animate={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.8)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
        }}
      >
        <motion.div
          className={classes.successOverlayDialog}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={classes.successOverlayDialogHeader}>
            <div className={classes.successOverlayTitle}>WELCOME TO</div>
            {renderLogoAnimation()}
          </div>
          <div className={classes.successOverlayDialogBody}>
            <p
              className={classes.successOverlayDialogText}
              style={{ fontWeight: "700" }}
            >
              Hey{props.firstname ? " " + props.firstname : ""},
            </p>
            <p className={classes.successOverlayDialogText}>
              We're excited to welcome you to the Styler community! To make sure
              you get off to the best start possible, begin by following our
              quick-start guide.
            </p>
            <p className={classes.successOverlayDialogText}>
              We will shortly send you a welcome email with details about your
              Consultant. Your Consultant will be in touch in the next 24 hours!
            </p>
            <p className={classes.successOverlayDialogText}>
              We can't wait to work with you,
            </p>
            <p
              className={classes.successOverlayDialogText}
              style={{ fontWeight: "700", marginBottom: 0 }}
            >
              The Styler Team
            </p>
            <hr />
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href="https://help.whatstyle.uk/guides/hub/quickstart"
              className={classes.successOverlayLinkButton}
              fullWidth
            >
              Open quick-start guide
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default withStyles(() => styles)(SuccessOverlay);
