import React from 'react'
import ReactDOM from 'react-dom/client'
import App, { BevestigingsPagina } from './App.jsx'

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')).render(
  path === '/bevestiging' ? <BevestigingsPagina /> : <App />
)
