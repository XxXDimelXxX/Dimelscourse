import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Course } from "./pages/Course";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/course/:courseId",
    Component: Course,
  },
]);
