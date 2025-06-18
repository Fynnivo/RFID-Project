import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import './styles/index.css'  // ← Import main CSS file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster position='top-center' reverseOrder={false} />
    <App />
  </React.StrictMode>,
)
