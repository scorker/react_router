import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import { useLocation } from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createCache";
import AppTheme from "./theme";
import { captureReferralAttributionFromSearch } from "./referral/attributionCookie";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Handle long load presentation screen
// let root: any;
// Router.events.on("routeChangeStart", (url) => {
//   root = createRoot(document.getElementById("page-transition"));
//   document.querySelector("body").classList.add("body-page-transition");
//   root.render(<PageChange path={url} />);
// });
// Router.events.on("routeChangeComplete", () => {
//   r
// Rouoot.unmount();
//   document.querySelector("body").classList.remove("body-page-transition");
// });ter.events.on("routeChangeError", () => {
//   root.unmount();
//   document.querySelector("body").classList.remove("body-page-transition");
// });

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const cache = createEmotionCache();

function ReferralAttributionTracker() {
  const location = useLocation();

  useEffect(() => {
    captureReferralAttributionFromSearch(
      location.search,
      `${location.pathname}${location.search}`,
    );
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  if (typeof window !== "undefined") {
    return (
      <CacheProvider value={cache}>
        <AppTheme>
          <ReferralAttributionTracker />
          <Outlet />
        </AppTheme>
      </CacheProvider>
    );
  }
  return (
    <AppTheme>
      <ReferralAttributionTracker />
      <Outlet />
    </AppTheme>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
