import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Header from "./components/Header";

// Pages
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import CertificatesPage from "./pages/CertificatesPage";

// Instructor Pages
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import InstructorEnrollmentsPage from "./pages/InstructorEnrollmentsPage";

// Lesson Page (combined list + detail)
import LessonPage from "./pages/LessonPage";

// -------------------- Protected Route --------------------
const ProtectedRoute = ({ children, instructorOnly = false }) => {
  const { user } = React.useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // not logged in
  if (instructorOnly && !user.is_instructor) return <Navigate to="/student-home" />; // only instructor
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

// -------------------- Default Redirect Component --------------------
const DefaultRedirect = () => {
  const { user } = React.useContext(AuthContext);

  if (!user) return <Navigate to="/login" />; // not logged in
  return user.is_instructor ? <Navigate to="/instructor-home" /> : <Navigate to="/student-home" />;
};

// -------------------- App --------------------
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Default */}
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
              path="/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesPage />
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

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
