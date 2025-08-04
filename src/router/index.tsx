import { createBrowserRouter } from "react-router";

import AuthLayout from "@/common/layouts/AuthLayout";
import MainLayout from "@/common/layouts/MainLayout";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Login from "@/pages/login";
import Hotels from "@/pages/hotels";
import App from "@/App";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "login", element: <Login /> }],
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "hotels", element: <Hotels /> },
          { path: "users", element: <Users /> },
        ],
      },
    ],
  },
]);
