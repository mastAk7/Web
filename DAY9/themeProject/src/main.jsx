import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider , Route, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout'
import Home from './components/Home'
import Red from './components/Red'
import Blue from './components/Blue'
import Green from './components/Green'
import Yellow from './components/Yellow'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} >
      <Route path='' element={<Home />} />
      <Route path='blue' element={<Blue />} />
      <Route path='green' element={<Green />} />
      <Route path='yellow' element={<Yellow />} />
      <Route path='red' element={<Red />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
