// Must run before the router is created (it reads the URL on import).
import "./variantRedirect"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import "./index.css"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
