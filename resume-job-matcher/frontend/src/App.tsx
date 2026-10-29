import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/jobseeker/Dashboard';
import ResumeUploadPage from './pages/jobseeker/ResumeUpload';
import EmployerDashboard from './pages/employer/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRole="job_seeker">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="job_seeker">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute allowedRole="job_seeker">
                <ResumeUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer"
            element={
              <ProtectedRoute allowedRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
