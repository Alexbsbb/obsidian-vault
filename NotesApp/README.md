# NotesApp 📝

Uma aplicação web de notas pessoais completa com React + Go backend.

## 📦 Setup Rápido

### Frontend (React)
```bash
cd NotesApp
npm install
npm run dev
```

Acesse em: `http://localhost:3000`

### Backend (Go)
```bash
cd ../NotesAppBackend
go mod download
go run main.go
```

Acesse em: `http://localhost:8080`

## 🚀 Funcionalidades MVP

- ✅ CRUD de notas (criar, ler, atualizar, excluir)
- ✅ Sistema de tags
- ✅ Busca em tempo real
- ✅ Suporte a Markdown
- ✅ Modo escuro
- ✅ Armazenamento local (localStorage)
- ✅ Design responsivo

## 📁 Estrutura

```
NotesApp/
├── src/
│   ├── components/    # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── stores/        # Estado global (Zustand)
│   ├── types/         # Interfaces TypeScript
│   └── App.tsx        # Roteamento
├── public/
├── package.json
└── README.md
```

## 🎨 Design

- **Paleta principal:** Indigo (#6366F1)
- **Modo claro/escuro automático**
- **Design responsivo mobile-first**

## 🔧 Scripts

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## 📝 API Backend

Endpoints disponíveis:
- `POST /api/v1/notes` - Criar nota
- `GET /api/v1/notes` - Listar notas
- `GET /api/v1/notes/:id` - Obter nota
- `PUT /api/v1/notes/:id` - Atualizar nota
- `DELETE /api/v1/notes/:id` - Excluir nota
- `GET /api/v1/notes/search?q=texto` - Buscar notas

---

**Desenvolvido com ❤️ usando React + Go + TailwindCSS**