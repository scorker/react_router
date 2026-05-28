import type { Route } from "./+types/referral";
import ReferralPage from "../referral/referral";
import "../../styles/scss/nextjs-material-kit-pro.scss";

import { createTheme, ThemeProvider } from "@mui/material";
import materialThemeOptions from "../../styles/jss/material-theme.js";

const theme = createTheme(materialThemeOptions);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Styler App" },
    { name: "description", content: "Welcome to Styler!" },
  ];
}

export default function Referral() {
  return (
    <ThemeProvider theme={theme}>
      <ReferralPage />
    </ThemeProvider>
  );
}
