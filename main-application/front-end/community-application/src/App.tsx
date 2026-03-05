import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout'
import Trending from './pages/Trending'
import Members from './pages/Members'
import Announcement from './pages/Announcement'
import General from './pages/General'
import DevTalk from './pages/dev-talk'
import Login from './pages/Login'
import Sign from './pages/Sign'
import { Toaster } from "sonner"

function App() {
  return (
    <>
    <DashboardLayout>
        
    <Routes>
        <Route path='/' element={<Home /> }/>
        <Route path='/login' element={<Login /> }/>
        <Route path='/sign' element={<Sign /> }/>
        <Route path='/trending' element={<Trending /> }/>
        <Route path='/members' element={<Members /> }/>
        <Route path='/spaces/announcements' element={<Announcement /> }/>
        <Route path='/spaces/general-chat' element={<General /> }/>
        <Route path='/spaces/developer-talk' element={<DevTalk />}/>
      </Routes>
    </DashboardLayout>
    <Toaster position='top-right' richColors />
    </>
    
    
  )
}

export default App