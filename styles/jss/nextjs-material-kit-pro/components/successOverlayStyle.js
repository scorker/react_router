import {
  primaryColor,
  secondaryColor,
  whiteColor,
  container,
  dangerColor,
  primaryBoxShadow,
} from "../../../jss/nextjs-material-kit-pro.js";

const successOverlayStyle = {
  successOverlayContainer: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 2,
    backgroundColor: "rgba(255,255,255,0)",
    backdropFilter: "blur(0px)",
    "-webkit-backdrop-filter": "blur(10px)",
  },
  successOverlayDialog: {
    ...container,
    ...primaryBoxShadow,
    color: primaryColor[0],
    padding: "0!important",
    backgroundColor: whiteColor,
    borderRadius: "1em",
    minHeight: 200,
    overflow: "hidden",
    "@media (min-width: 991px)": {
      maxWidth: "720px",
    },
  },
  successOverlayDialogHeader: {
    width: "100%",
    backgroundColor: primaryColor[0],
    padding: "1.5em",
  },
  successOverlayDialogBody: {
    backgroundColor: primaryColor[6],
    padding: "1.5em",
  },
  successOverlayTitle: {
    fontSize: "1.4em",
    textAlign: "center",
    lineHeight: "1em",
    color: primaryColor[1],
    paddingBottom: "0.2em",
    //background: '-webkit-linear-gradient(' + secondaryColor[0] + ', ' + secondaryColor[0] + ', ' + primaryColor[0] + ')',
    //'-webkit-background-clip': 'text',
    //'-webkit-text-fill-color': 'transparent',
    fontWeight: "600",
    letterSpacing: "0.4em",
    textShadow: "0 0 32px black;",
  },
  successOverlayDialogText: {
    fontSize: "1.1em",
    lineHeight: "1.7em",
  },
  successOverlayLinkButton: {
    "&:hover": {
      color: "#ebebeb",
    },
  },
};

export default successOverlayStyle;
