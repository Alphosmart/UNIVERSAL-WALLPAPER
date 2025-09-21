import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index";
import { store } from './store/store';
import { Provider } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
import { AnalyticsProvider } from './components/AnalyticsProvider';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <AnalyticsProvider>
        <RouterProvider router={router} />
      </AnalyticsProvider>
    </Provider>
  </ErrorBoundary>
);