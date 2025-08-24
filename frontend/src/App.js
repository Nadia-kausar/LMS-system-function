import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Components
import Header from "./components/Header";

// Student Pages
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import MyCertificatesPage from "./pages/MyCertificatesPage"; // ✅

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Instructor Pages
import Dashboard from "./pages/Dashboard";
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import InstructorEnrollmentsPage from "./pages/InstructorEnrollmentsPage";
import IssueCertificatePage from "./pages/IssueCertificatePage"; // ✅

// -------------------- Protected Route --------------------
const ProtectedRoute = ({ children, instructorOnly = false, studentFallback = null }) => {
  const { user } = React.useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (instructorOnly && !user.is_instructor) {
    return studentFallback ? studentFallback : <Navigate to="/student-home" />;
  }

  return children;
};

// -------------------- Layout --------------------
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
};

// -------------------- Default Redirect --------------------
const DefaultRedirect = () => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return user.is_instructor ? (
    <Navigate to="/instructor-home" />
  ) : (
    <Navigate to="/student-home" />
  );
};

// -------------------- App --------------------
function AppRoutes() {
  const { user } = React.useContext(AuthContext);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Redirect */}
          <Route path="/" element={<DefaultRedirect />} />

          {/* Student Routes */}
          <Route
            path="/student-home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons"
            element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute>
                <MyEnrollmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-certificates"
            element={
              <ProtectedRoute>
                <MyCertificatesPage studentId={user?.id} />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor-home"
            element={
              <ProtectedRoute instructorOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor-courses"
            element={
              <ProtectedRoute instructorOnly={true}>
                <InstructorCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor-enrollments"
            element={
              <ProtectedRoute instructorOnly={true}>
                <InstructorEnrollmentsPage />
              </ProtectedRoute>
            }
          />

          {/* Certificates Route → Instructor gets IssueCertificatePage, Student gets MyCertificatesPage */}
          <Route
            path="/issue-certificate"
            element={
              <ProtectedRoute
                instructorOnly={true}
                studentFallback={<MyCertificatesPage studentId={user?.id} />}
              >
                <IssueCertificatePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
