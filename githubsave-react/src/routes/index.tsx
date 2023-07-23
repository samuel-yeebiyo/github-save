import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Root, Home, Recents, Saved, Repos } from "../pages";

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <App />,
    // errorElement: <ErrorPage />
  },
  {
    path: "/",
    element: <Root />,
    // errorElement: <ErrorPage />
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "recents",
        element: <Recents />,
      },
      {
        path: "saved",
        element: <Saved />,
      },
      {
        path: "repos",
        element: <Repos />,
      },
    ],
  },
]);

export default router;
