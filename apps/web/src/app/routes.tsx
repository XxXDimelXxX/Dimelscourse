import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Courses } from "./pages/Courses";
import { Dashboard } from "./pages/Dashboard";
import { CourseView } from "./pages/CourseView";
import { Purchase } from "./pages/Purchase";
import { NotFound } from "./pages/NotFound";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminPayments } from "./pages/admin/AdminPayments";
import { AdminCourse } from "./pages/admin/AdminCourse";
import { AdminCoursesList } from "./pages/admin/AdminCoursesList";
import { AdminCourseMeta } from "./pages/admin/AdminCourseMeta";
import { AdminCourseStructure } from "./pages/admin/AdminCourseStructure";
import { AdminCourseResources } from "./pages/admin/AdminCourseResources";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/courses",
    Component: Courses,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/course/:courseId",
    Component: CourseView,
  },
  {
    path: "/purchase",
    Component: Purchase,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: "users",
        Component: AdminUsers,
      },
      {
        path: "payments",
        Component: AdminPayments,
      },
      {
        path: "course",
        Component: AdminCourse,
      },
      {
        path: "courses",
        Component: AdminCoursesList,
      },
      {
        path: "courses/:slug",
        Component: AdminCourseMeta,
      },
      {
        path: "courses/:slug/structure",
        Component: AdminCourseStructure,
      },
      {
        path: "courses/:slug/resources",
        Component: AdminCourseResources,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
