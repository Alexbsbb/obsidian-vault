// ZapSenderAPI - Versão básica sem dependências
// Para executar: node http-server.js

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 8080

// Cores do tema ZapSender
const COLORS = {
  primary: '#FF4500',   // Laranja derretido
  secondary: '#000000', // Preto profundo
  accent: '#FFA500',    // Laranja vibrante
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444'
}

// Health check response
const healthResponse = JSON.stringify({
  status: 'ok',
  service: 'ZapSenderAPI',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  colors: COLORS,
  message: '✅ ZapSenderAPI funcionando com sucesso!',
  endpoints: {
    '/health': 'GET - Verifica saúde da API',
    '/status': 'GET - Status detalhado',
    '/colors': 'GET - Paleta de cores',
    '/api/v1/notes': 'CRUD para notas (em desenvolvimento)'
  }
}, null, 2)

const statusResponse = JSON.stringify({
  status: 'running',
  service: 'ZapSenderAPI',
  version: '1.0.0',
  uptime: process.uptime(),
  port: PORT,
  colors: COLORS,
  initialized: true
}, null, 2)

const colorsResponse = JSON.stringify(COLORS, null, 2)

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0]
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Routes
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(healthResponse)
  } else if (url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(statusResponse)
  } else if (url === '/colors') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(colorsResponse)
  } else if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZapSenderAPI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #000; color: #fff; padding: 40px; }
    .header { color: #FF4500; font-size: 24px; margin-bottom: 20px; }
    .button { background: #FF4500; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .button:hover { background: #FFA500; }
    pre { background: #111; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="header">🚀 ZapSenderAPI</div>
  <p>WhatsApp Mass Messaging API - funcionando!</p>
  <p>Porta: ${PORT}</p>
  <p>Tema: <span style="color: #FF4500;">Laranja</span> e <span style="color: #000000;">Preto</span></p>
  <h2>Endpoints:</h2>
  <ul>
    <li>/health - Health check</li>
    <li>/status - Status do sistema</li>
    <li>/colors - Paleta de cores</li>
  </ul>
</body>
</html>`)
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found', url }, null, 2))
  }
})

server.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('  🚀 ZapSenderAPI RODANDO')
  console.log('='.repeat(50))
  console.log(`Porta: ${PORT}`)
  console.log(`Tema: #FF4500 (laranja) e #000000 (preto)`)
  console.log(`Health: http://localhost:${PORT}/health`)
  console.log('='.repeat(50))
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Encerrando servidor...')
  server.close(() => {
    console.log('Servidor encerrado')
    process.exit(0)
  })
})