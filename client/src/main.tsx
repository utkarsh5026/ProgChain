import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import store from "./store/store.ts";
import { Provider } from "react-redux";
import "./index.css";
import router from "./router.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "monospace",
          fontSize: 18,
        },
      }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
