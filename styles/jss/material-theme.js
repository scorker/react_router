import { primaryColor, secondaryColor, successColor } from "./nextjs-material-kit-pro";

export default {
    palette: {
        type: 'light',
        primary: {
            main: primaryColor[0]
        },
        secondary: {
            main: secondaryColor[0]
        },
        success: {
            main: successColor[0],
            contrastText: '#fff',
        },
        text: {
            success: '#ffffff',
        }
    },
    typography: {
        fontFamily: [
            "Public Sans",
            "Helvetica",
            "Arial",
            "sans-serif"
        ].join(',')
    }
}