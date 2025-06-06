import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

// Em desenvolvimento, mantém o StrictMode para ajudar a encontrar problemas
if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  // Em produção, remove o StrictMode para melhor desempenho
  root.render(<App />)
}
