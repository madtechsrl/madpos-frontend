import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Import Bootstrap and FontAwesome
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
