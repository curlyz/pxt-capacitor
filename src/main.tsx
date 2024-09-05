import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { KonstaProvider } from "konsta/react";
import { BluetoothProvider } from "./providers/bluetooth";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BluetoothProvider>
      <KonstaProvider theme="parent">
        <App />
      </KonstaProvider>
    </BluetoothProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
