import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/landing/landing'
import Register from './pages/register/register'
import OtpValidate from './pages/otp/otp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/OtpValidate" element={<OtpValidate />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)