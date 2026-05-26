import React, { useEffect, useState } from "react";

import { withStyles } from "@mui/styles";
// Lottie
import * as handeWaveData from "../../lotties/hand-wave.json";
// Stylesheet
// @ts-ignore - declaration shim not present for this JS style module
import styles from "../../styles/jss/nextjs-material-kit-pro/components/presentationSlideStyle.js";


const PresentationSlide = (props: any) => {
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

  const renderHandWave = () => {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: handeWaveData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return (
      <div style={{ marginLeft: 5 }}>
        {LottieComponent && (
          <LottieComponent options={defaultOptions} width={70} />
        )}
      </div>
    );
  };

  return (
    <div className={classes.slideContainer}>
      <div className={classes.presentationCurveContainer}>
        <svg
          height="100%"
          width="100%"
          style={{
            overflow: "visible",
            position: "relative",
            top: "-98%",
            right: "-40%",
          }}
        >
          <circle
            cx="80%"
            cy="80%"
            r="80%"
            className={classes.presentationCurve}
          />
        </svg>
        <svg
          height="100%"
          width="100%"
          style={{
            overflow: "visible",
            position: "relative",
            bottom: "78%",
            right: "-60%",
          }}
        >
          <circle
            cx="90%"
            cy="90%"
            r="90%"
            className={classes.presentationCurve}
          />
        </svg>
      </div>
      <div className={classes.presentationTitle}>
        <span>Hey there</span>
        {renderHandWave()}
      </div>
    </div>
  );
};

export default withStyles(() => styles)(PresentationSlide);
