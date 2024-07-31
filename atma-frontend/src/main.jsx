import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./contexts/TaskProvider.jsx";
import ThemeProvider from "./contexts/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Toaster position="top-center" />
      <TaskProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </TaskProvider>
    </Router>
  </React.StrictMode>
);
