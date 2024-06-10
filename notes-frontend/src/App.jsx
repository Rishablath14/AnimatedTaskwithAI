import { Navigate, Route, Routes } from 'react-router-dom'
import Notes from './components/Notes'
import { SignupFormDemo } from './components/signup'
import { LoginFormDemo } from './components/login'

const App = () => {
  return (
    <Routes>
     <Route path='/signup' element={<SignupFormDemo/>} />
     <Route path='/login' element={<LoginFormDemo/>} />
     <Route path='/' element={<Notes/>} />
     <Route path="*" element={<Navigate to="/login"/>} />
    </Routes>
  )
}

export default App