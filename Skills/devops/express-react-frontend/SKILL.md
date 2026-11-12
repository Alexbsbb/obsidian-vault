# Servir Frontend React com Express.js e Docker

## 📋 Objetivo
Configurar servidor Node.js/Express para servir aplicação React/TypeScript, resolvendo problemas de CSP, CORS e assets estáticos.

## 🔧 Procedimento
1. **Verificar estrutura do frontend**  
   - Frontend em `/manager/` com `index.html` e `src/`
   - React TypeScript (.tsx) precisa de build Vite

2. **Configurar Express.js para arquivos estáticos**
   ```javascript
   app.use('/src', express.static(path.join(__dirname, '..', 'manager', 'src')));
   app.use('/assets', express.static(path.join(__dirname, '..', 'manager', 'assets')));
   ```

3. **Servir páginas HTML**
   ```javascript
   app.get('/manager', (req, res) => {
     const htmlPath = path.join(__dirname, '..', 'manager', 'index.html');
     res.sendFile(htmlPath);
   });
   ```

4. **Configurar CSP (Content Security Policy)**
   - NÃO usar `font-family` (diretiva inválida)
   - Usar `fontFamily` (camelCase) ou remover se não necessário

5. **Build do React (produção)**
   ```bash
   cd D:/apiwhatsapp/manager
   npm install && npm run build
   ```

## ⚠️ Perigos Comuns
- **CSP font-family inválido** → Usar `fontFamily` ou remover
- **React .tsx não serve direto** → Sempre fazer build Vite
- **Path relativo errado** → Usar `__dirname` como ponto de partida

## 📦 Endpoints Funcionais
| Endpoint | Status |
|----------|--------|
| GET /health | ✅ Healthy |
| GET /status | ✅ Operational |
| GET /colors | ✅ Paleta |
| GET /manager | ✅ HTML Manager |
| POST /api/v1/messages | ✅ Com autenticação |
| POST /api/v1/messages/bulk | ✅ Batch processing |