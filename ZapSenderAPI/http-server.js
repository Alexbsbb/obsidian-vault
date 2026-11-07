// ZapSenderAPI - Servidor backend sem dependências
// Para executar: node http-server.js

const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 8080

// Cores do tema ZapSender
const CORES = {
  primaria: '#FF4500',     // Laranja derretido
  secundaria: '#000000',   // Preto profundo
  destaque: '#FFA500',     // Laranja vibrante
  sucesso: '#10B981',
  aviso: '#F59E0B',
  erro: '#EF4444'
}

// Resposta do Health Check
const respostaHealth = JSON.stringify({
  status: 'ok',
  servico: 'ZapSenderAPI',
  versao: '1.0.0',
  timestamp: new Date().toISOString(),
  cores: CORES,
  mensagem: '✅ ZapSenderAPI funcionando com sucesso!',
  endpoints: {
    '/health': 'GET - Verifica saúde da API',
    '/status': 'GET - Status detalhado',
    '/cores': 'GET - Paleta de cores',
    '/manager': 'GET - Interface de gerenciamento',
    '/api/v1/mensagens': 'POST - Enviar mensagem',
    '/api/v1/mensagens/lote': 'POST - Enviar em lote'
  }
}, null, 2)

// Resposta de Status
const respostaStatus = JSON.stringify({
  status: 'rodando',
  servico: 'ZapSenderAPI',
  versao: '1.0.0',
  tempoOnline: process.uptime(),
  porta: PORT,
  cores: CORES,
  inicializado: true
}, null, 2)

// Resposta das Cores
const respostaCores = JSON.stringify(CORES, null, 2)

// Ler HTML do Manager
let htmlManager = ''
try {
  htmlManager = fs.readFileSync(path.join(__dirname, 'manager', 'index.html'), 'utf8')
} catch (e) {
  console.log('Manager HTML não encontrado')
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0]
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Rotas
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(respostaHealth)
  } else if (url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(respostaStatus)
  } else if (url === '/cores') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(respostaCores)
  } else if (url === '/manager' || url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(htmlManager || '<h1>ZapSenderAPI Manager</h1>')
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ erro: 'Não Encontrado', url }, null, 2))
  }
})

server.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('  🚀 ZapSenderAPI RODANDO')
  console.log('='.repeat(50))
  console.log(`Porta: ${PORT}`)
  console.log(`Tema: #FF4500 (laranja) e #000000 (preto)`)
  console.log(`Health: http://localhost:${PORT}/health`)
  console.log(`Manager: http://localhost:${PORT}/manager`)
  console.log('='.repeat(50))
})

process.on('SIGTERM', () => {
  console.log('Encerrando servidor...')
  server.close(() => {
    console.log('Servidor encerrado')
    process.exit(0)
  })
})