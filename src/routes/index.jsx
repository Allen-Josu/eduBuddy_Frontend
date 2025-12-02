import { createBrowserRouter } from "react-router-dom";
import { routePath } from "../config";
import Home from "../pages/home";
import PageNotFound from "../pages/notFound";
import Notes from "../pages/notes";

import PreviousYear from "../pages/previousYearQuestions";
import DepartmentPage from "../admin/pages/department";
import UsersPage from "../admin/pages/users";
import AddUserDrawer from "../admin/drawer/add-user";
import ViewDepartment from "../admin/drawer/view-department";
import AddDepartment from "../admin/drawer/add-department";
import EditDepartment from "../admin/drawer/edit-department";
import About from "../pages/about";
import GradePredictor from "../pages/gradePredictor/gradePredictor";

import QuestionPaperGenerator from "../pages/modelQuestionGenerator";
import Signup from "../pages/signup";
import Login from "../pages/login/login";
import ViewUser from "../admin/drawer/view-user";
import AdminLogin from "../admin/pages/login";
import ProtectedRoute from "../admin/components/protectedRoute";
import UserProtectedRoute from "../components/protectedRoute";
import AttendanceRegulator from "../pages/attendanceRegulator";
import OTPVerification from "../pages/otp-verification";

export const router = createBrowserRouter([
  {
    path: routePath.home,
    element: <Home />,
  },
  {
    path: routePath.verifyOTP,
    element: <OTPVerification />,
  },
  {
    path: routePath.notes,
    element: <Notes />,
  },
  {
    path: routePath.pyq,
    element: <PreviousYear />,
  },
  {
    path: routePath.gradePredictor,
    element: <GradePredictor />,
  },
  {
    path: routePath.attendanceRegulator,
    element: (
      <UserProtectedRoute>
        <AttendanceRegulator />
      </UserProtectedRoute>
    ),
  },
  {
    path: routePath.adminLogin,
    element: <AdminLogin />,
  },
  {
    path: routePath.login,
    element: <Login />,
  },
  {
    path: routePath.signup,
    element: <Signup />,
  },
  {
    path: routePath.about,
    element: <About />,
  },
  {
    path: routePath.modelQuestionGenerator,
    element: (
      <UserProtectedRoute>
        <QuestionPaperGenerator />
      </UserProtectedRoute>
    ),
  },
  {
    path: routePath.department,
    element: (
      <ProtectedRoute>
        <DepartmentPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: `${routePath.viewDepartment}/:entityId`,
        element: (
          <ProtectedRoute>
            <ViewDepartment />
          </ProtectedRoute>
        ),
      },
      {
        path: routePath.addDepartment,
        element: (
          <ProtectedRoute>
            <AddDepartment />
          </ProtectedRoute>
        ),
      },
      {
        path: `${routePath.editDepartment}/:entityId`,
        element: (
          <ProtectedRoute>
            <EditDepartment />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: routePath.users,
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: `${routePath.addUser}`,
        element: (
          <ProtectedRoute>
            <AddUserDrawer />
          </ProtectedRoute>
        ),
      },
      {
        path: `${routePath.viewUser}/:entityId`,
        element: (
          <ProtectedRoute>
            <ViewUser />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);
