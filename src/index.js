import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Creating the root element for rendering
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measuring (optional)
if (process.env.NODE_ENV === "production") {
  reportWebVitals(console.log); // Logs only in production
}
