import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AgendarCita from "./pages/AgendarCita";
import ConfirmacionCita from "./pages/ConfirmacionCita";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import ReagendarCita from "./pages/ReagendarCita";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/agendar-cita"
            element={
              <PrivateRoute>
                <AgendarCita />
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmacion"
            element={
              <PrivateRoute>
                <ConfirmacionCita />
              </PrivateRoute>
            }
          />
          <Route
            path="/reagendar/:id"
            element={
              <PrivateRoute>
                <ReagendarCita />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
