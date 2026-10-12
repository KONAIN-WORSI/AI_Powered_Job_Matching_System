import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound'
import JobDetail from '../pages/jobseeker/JobDetail'
import JobResults from '../pages/jobseeker/JobResults'
import JobSeekerDashboard from '../pages/jobseeker/Dashboard'
import ResumeUploadPage from '../pages/jobseeker/ResumeUpload'
import CandidateDetail from '../pages/employer/CandidateDetail'
import Candidates from '../pages/employer/Candidates'
import EmployerDashboard from '../pages/employer/Dashboard'
import PostJob from '../pages/employer/PostJob'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route element={<JobSeekerDashboard />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<JobResults />} path="/jobs" />
          <Route element={<JobDetail />} path="/jobs/:jobId" />
          <Route element={<ResumeUploadPage />} path="/resume" />
          <Route element={<EmployerDashboard />} path="/employer" />
          <Route element={<PostJob />} path="/employer/jobs/new" />
          <Route element={<Candidates />} path="/employer/candidates" />
          <Route element={<CandidateDetail />} path="/employer/candidates/:candidateId" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
