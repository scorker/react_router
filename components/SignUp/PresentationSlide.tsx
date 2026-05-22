import React, { useEffect, useState } from "react";
// @material-ui/core components
//import { makeStyles } from "@mui/styles";
// Lottie
//import * as handeWaveData from "../../lotties/hand-wave.json";
// Stylesheet
// @ts-ignore - declaration shim not present for this JS style module
//import styles from "../../styles/jss/nextjs-material-kit-pro/components/presentationSlideStyle.js";

//const useStyles = makeStyles(styles as any);

const slideContainer: React.CSSProperties = {
  flex: "1 1 15%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  borderRadius: "3em 0 0 3em",
  backgroundSize: "cover",
  backgroundColor: "#0a122b",
  backgroundPosition: "left",
};

const presentationCurveContainer: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
};

const presentationCurve: React.CSSProperties = {
  fill: "transparent",
  stroke: "#ff2b54",
  strokeWidth: "3.1em",
};

const presentationTitle: React.CSSProperties = {
  color: "#FFF",
  display: "flex",
  fontSize: "3em",
  alignSelf: "center",
  fontWeight: 200,
  marginLeft: "2em",
};

export default function PresentationSlide() {
  //const classes = useStyles();
  // const [LottieComponent, setLottieComponent] = useState<
  //   React.ComponentType<any> | null
  // >(null);

  useEffect(() => {
    let isMounted = true;
    // import("react-lottie")
    //   .then((module) => {
    //     if (isMounted) {
    //       setLottieComponent(() => module.default as React.ComponentType<any>);
    //     }
    //   })
    //   .catch(() => {
    //     // Keep animation hidden if import fails.
    //   });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderHandWave = () => {
    // if (!LottieComponent) {
    //   return null;
    // }
    return (
      <div style={{ margin: "-20px 0px -20px 20px" }}>
        <img
          src="/img/golden-hand-wave.svg"
          alt="Golden hand wave"
          width={56}
          height={56}
          style={{ display: "block" }}
        />
      </div>
    );
  };

  return (
    <div
      style={slideContainer} //className={classes.slideContainer}
    >
      <div
        style={presentationCurveContainer} //className={classes.presentationCurveContainer}
      >
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
            style={presentationCurve}
            //className={classes.presentationCurve}
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
            style={presentationCurve}
            //className={classes.presentationCurve}
          />
        </svg>
      </div>
      <div
        style={presentationTitle} //className={classes.presentationTitle}
      >
        <span>Hey there</span>
        {renderHandWave()}
      </div>
    </div>
  );
}
