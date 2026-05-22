import {
  primaryColor,
  secondaryColor,
  whiteColor,
} from "../../../jss/nextjs-material-kit-pro.js";

const presentationSlideStyle = {
  slideContainer: {
    //backgroundImage: "url('/img/signup_slide_bg.jpg')",
    display: "flex",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "left",
    flex: "1 1 15%",
    backgroundColor: primaryColor[0],
    borderRadius: "3em 0 0 3em",
    "@media (max-width: 1199px)": {
      flex: "1 1 10%",
    },
    "@media (max-width: 1099px)": {
      flex: "1 1 5%",
    },
    "@media (max-width: 992px)": {
      display: "none",
    },
    overflow: "hidden",
  },
  presentationCurveContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  presentationCurve: {
    fill: "transparent",
    stroke: secondaryColor[0],
    strokeWidth: "3.1em",
    /*strokeLinecap: "round",
        transformOrigin: "50% 50%",
        strokeDasharray: 280,
        strokeDashoffset: 75*/
  },
  presentationTitle: {
    display: "flex",
    fontWeight: "200",
    alignSelf: "center",
    color: whiteColor,
    fontSize: "3em",
    marginLeft: "2em",
  },
};

export default presentationSlideStyle;
