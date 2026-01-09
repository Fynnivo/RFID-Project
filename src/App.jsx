import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './app/providers/AuthProvider';
import ProtectedRoute from './app/router/ProtectedRoute';
import PublicRoute from './app/router/PublicRoute';
import Dashboard from './features/dashboard/pages/Dashboard';
import Login from './features/auth/pages/Login';
import Attendance from './features/attendance/pages/Attendance';
import User from './features/user/pages/User';
import Schedule from './features/schedule/pages/Schedule';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/attendances" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
