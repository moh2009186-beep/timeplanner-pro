import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Schedule from "./pages/Schedule";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";

const About = lazy(() => import("./pages/About"));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary" /></div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="settings" element={<Settings />} />
        <Route path="about" element={<Suspense fallback={<div className="d-flex justify-content-center align-items-center py-5"><div className="spinner-border text-primary" /></div>}><About /></Suspense>} />
        <Route path="*" element={<div className="text-center py-5"><h2>404</h2><p>Page Not Found</p></div>} />
      </Route>
    </Routes>
  );
}

export default App;
