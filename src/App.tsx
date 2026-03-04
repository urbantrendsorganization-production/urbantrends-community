import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout'
import Trending from './pages/Trending'
import Members from './pages/Members'
import Announcement from './pages/Announcement'
import General from './pages/General'
import DevTalk from './pages/dev-talk'

function App() {
  return (
    <DashboardLayout>
        
    <Routes>
        <Route path='/' element={<Home /> }/>
        <Route path='/trending' element={<Trending /> }/>
        <Route path='/members' element={<Members /> }/>
        <Route path='/spaces/announcements' element={<Announcement /> }/>
        <Route path='/spaces/general-chat' element={<General /> }/>
        <Route path='/spaces/developer-talk' element={<DevTalk />}/>
      </Routes>
    </DashboardLayout>
  )
}

export default App