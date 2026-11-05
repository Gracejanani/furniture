import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import App from "./App";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const app = <App />;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {convexUrl ? <ConvexProvider client={new ConvexReactClient(convexUrl)}>{app}</ConvexProvider> : app}
  </React.StrictMode>
);