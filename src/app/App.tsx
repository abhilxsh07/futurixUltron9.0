import  { Route, Routes } from "react-router-dom"
import Navbar from "../components/Navbar"
import ParallaxBackground from "../components/ParallaxBackground"
import Overview from "../pages/Overview"
import Prizes from "../pages/Prizes"
import Schedule from "../pages/Schedule"
import Projects from "../pages/Projects"
import ProjectDetail from "../pages/ProjectDetail"
import SignIn from "../pages/SignIn"
import SubmitProject from "../pages/SubmitProject"
import EditProject from "../pages/EditProject"
import AdminDashboard from "../pages/AdminDashboard"
import { AuthProvider } from "./auth"
import ProtectedRoute from "../components/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-base-900 text-white relative overflow-hidden">
        <ParallaxBackground />
        <div className="relative z-10">
          <Navbar />
          <main className="px-4 sm:px-6 lg:px-10 pb-24">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/signin" element={<SignIn />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/submit" element={<SubmitProject />} />
                <Route path="/edit/:slug" element={<EditProject />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
