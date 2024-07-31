import { Navigate, Route, Routes } from 'react-router-dom'
import Tasks from './components/Tasks'
import { SignupFormDemo } from './components/Signup'
import { LoginFormDemo } from './components/Login'

const App = () => {
  return (
    <Routes>
     <Route path='/signup' element={<SignupFormDemo/>} />
     <Route path='/login' element={<LoginFormDemo/>} />
     <Route path='/' element={<Tasks/>} />
     <Route path="*" element={<Navigate to="/login"/>} />
    </Routes>
  )
}

export default App