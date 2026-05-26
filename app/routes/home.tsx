import type { Route } from "./+types/home";
import SignUp from "../signup/signup";
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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <SignUp />
    </ThemeProvider>
  );
}
