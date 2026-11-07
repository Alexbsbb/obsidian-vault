const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080

// Middleware
app.use(cors())
app.use(express.json())

// Cores do tema
const COLORS = {
  primary: '#FF4500',   // Laranja derretido
  secondary: '#000000', // Preto profundo
  accent: '#FFA500'    // Laranja vibrante
}

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ZapSenderAPI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    colors: COLORS,
    message: 'API funcionando!'
  })
})

// Status
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    ports: [PORT],
    endpoints: [
      { method: 'GET', path: '/health', desc: 'Health check' },
      { method: 'GET', path: '/status', desc: 'Status do sistema' }
    ]
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 ZapSenderAPI rodando na porta ${PORT}`)
  console.log(`🎨 Tema: Laranja (#FF4500) e Preto (#000000)`)
  console.log(`✅ Health: http://localhost:${PORT}/health`)
})