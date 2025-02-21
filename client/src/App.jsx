import React, { lazy } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"


const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))

const App = () => {
  return (
     <BrowserRouter>
     <Routes>
      <Route path='/' element = { <Home/> } />
      <Route path='/Login' element = { <Login /> } />
      <Route path='/Chat' element = { <Chat /> } />
      <Route path='/Groups' element = { <Groups /> } />
      <Route path='/About' element = { <h1>About</h1> } />
     </Routes>
     </BrowserRouter>
  )
}

export default App