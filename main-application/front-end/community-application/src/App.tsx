import { Route, Routes, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout'
import Trending from './pages/Trending'
import Members from './pages/Members'
import Announcement from './pages/Announcement'
import General from './pages/General'
import DevTalk from './pages/dev-talk'
import Login from './pages/Login'
import Sign from './pages/Sign'
import Profile from './pages/Profile'
import { Toaster } from "sonner"
import { ProtectedRoute } from "./components/ProtectedRoute" // Import your firewall

function App() {
  return (
    <>
      <Routes>
        {/* GATEWAY: Public Auth Routes (No Sidebar) */}
        <Route path='/login' element={<Login />} />
        <Route path='/sign' element={<Sign />} />

        {/* SYSTEM_GRID: Internal Routes (With Sidebar/Layout) */}
        <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
          
          {/* Publicly readable pages inside layout */}
          <Route path='/' element={<Home />} />
          <Route path='/trending' element={<Trending />} />

          {/* SECURE_NODES: Requires active session */}
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/members' 
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/spaces/announcements' 
            element={
              <ProtectedRoute>
                <Announcement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/spaces/general-chat' 
            element={
              <ProtectedRoute>
                <General />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/spaces/developer-talk' 
            element={
              <ProtectedRoute>
                <DevTalk />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>

      <Toaster position='top-right' richColors />
    </>
  )
}

export default App