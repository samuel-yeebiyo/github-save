import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./query/index.ts";

import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.tsx";

import { ThemeProvider } from "./context/themeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={routes} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
