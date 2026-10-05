import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/toast.css'
import App from './App.jsx'
import { ToastContainer, Zoom } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick={false}
      pauseOnHover={true}
      draggable={true}
      theme="dark"
      transition={Zoom}
    />
  </StrictMode>,
)
