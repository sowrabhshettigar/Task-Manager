import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from "virtual:pwa-register";
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.jsx'

import reactAxe from 'react-axe'

if (process.env.NODE_ENV !== 'production') {
  reactAxe(React, ReactDOM, 1000)
}

registerSW({
  immediate: true,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
