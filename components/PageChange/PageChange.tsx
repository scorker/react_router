import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

// core components
import { secondaryColor } from "../../styles/jss/nextjs-material-kit-pro.js";

const styles = {
  progress: {
    color: secondaryColor[0],
    width: "4rem",
    height: "4rem",
  },
  wrapperDiv: {
    margin: "100px auto",
    padding: "0px",
    maxWidth: "360px",
    textAlign: "center" as const,
    position: "relative" as const,
    zIndex: 9999,
    top: 0,
  },
  iconWrapper: {
    display: "block",
  },
};

const PageChange = (props: any) => {
  return (
    <div>
      <div style={styles.wrapperDiv}>
        <div style={styles.iconWrapper}>
          <CircularProgress sx={styles.progress} />
        </div>
      </div>
    </div>
  );
};

export default PageChange;
