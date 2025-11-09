import {Routes,Route} from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { Game } from './pages/Game'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/game' element={<Game/>}/>
    </Routes>
    </>
  )
}

export default App
