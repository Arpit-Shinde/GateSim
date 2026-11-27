import { useState } from 'react'
import Home from './routes/Home'
import Simulator from './routes/simulator'
import Login from './routes/Login'
import SignUp from './routes/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/simulator" element={<Simulator></Simulator>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
