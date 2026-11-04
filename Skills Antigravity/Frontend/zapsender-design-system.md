---
tags: [antigravity-skill, frontend]
categoria: "Frontend"
origem: Antigravity
---

# zapsender-design-system

**Descrição:** Sistema oficial de design e padrões visuais da interface do ZapSender com suporte rigoroso a multi-temas (Orange, Green, Rose, Slate, Dark e Light).

---

## Conteúdo Original

---
name: zapsender-design-system
description: Sistema oficial de design e padrões visuais da interface do ZapSender com suporte rigoroso a multi-temas (Orange, Green, Rose, Slate, Dark e Light).
---
tags: [antigravity-skill]
categoria: sem-categoria

# ZapSender UI Design System & Multi-Theme Architecture

Este documento define as diretrizes estritas de interface do usuário, cores, tipografia e anatomia de componentes para o **ZapSender**. Qualquer nova página, modal, componente ou layout criado ou refatorado no projeto DEVE obedecer rigorosamente a este guia.

---

## 1. REGRA DE OURO: ZERO CORES CHUMBADAS (HARDCODED HEX)

O ZapSender possui um sistema dinâmico de temas com **4 Paletas Principais** (Orange, Green, Rose, Slate) e **2 Modos** (Dark e Light).

> ⚠️ **PROIBIDO:** Nunca use cores HEX diretamente nas classes do Tailwind (ex: `bg-[#ff801f]`, `text-[#0f1117]`). Se você fizer isso, a cor não vai mudar quando o usuário alternar o tema!
>
> ✅ **OBRIGATÓRIO:** Sempre utilize as variáveis CSS semânticas: `bg-[var(--primary)]`, `bg-[var(--bg-card)]`, `text-[var(--text-main)]`, `border-[var(--border-subtle)]`.

---

## 2. Dicionário de Variáveis CSS (Tokens Oficiais)

Sempre mapeie seus componentes para estas variáveis declaradas no `globals.css`:

### 2.1 Superfícies & Fundos
- **Fundo da Tela/App:** `bg-[var(--bg-app)]`
- **Fundo da Sidebar:** `bg-[var(--bg-sidebar)]`
- **Fundo de Cards / Containers:** `bg-[var(--bg-card)]`
- **Hover de Cards:** `hover:bg-[var(--bg-card-hover)]`
- **Fundo de Inputs & Selects:** `bg-[var(--bg-input)]`
- **Fundo Sutil / Tags Neutras:** `bg-[var(--bg-subtle)]`

### 2.2 Bordas & Divisões
- **Borda Padrão (Cards, Modais, Inputs):** `border-[var(--border-subtle)]`
- **Borda de Destaque / Hover:** `hover:border-[var(--border-hover)]` ou `border-[var(--border-card)]`

### 2.3 Tipografia & Cores de Texto
- **Texto Principal (Títulos e dados):** `text-[var(--text-main)]`
- **Texto Secundário / Descrições:** `text-[var(--text-muted)]`
- **Texto Apagado / Legendas:** `text-[var(--text-dim)]`

### 2.4 Cor Dinâmica de Ação (Acompanha o Tema Ativo)
- **Ação Primária / Botão Principal:** `bg-[var(--primary)]`
- **Hover Primário:** `hover:bg-[var(--primary-hover)]`
- **Texto de Contraste no Botão Primário:** `text-[var(--primary-contrast)]`
- **Fundo Suave com a cor do Tema (Badges ativas):** `bg-[var(--primary-light)]`
- **Glow / Sombra de Destaque:** `shadow-[var(--primary-glow)]`

### 2.5 Status do WhatsApp & Mensageria (Fixos)
- **Enviado:** `text-[#ff801f]` / `bg-[#ff801f]/10`
- **Entregue:** `text-[#38bdf8]` / `bg-[#38bdf8]/10`
- **Lido:** `text-[#a855f7]` / `bg-[#a855f7]/10`
- **Falha:** `text-[#ef4444]` / `bg-[#ef4444]/10`
- **Fila:** `text-[#eab308]` / `bg-[#eab308]/10`
- **Sucesso:** `text-[#10b981]` / `bg-[#10b981]/10`

---

## 3. Tipografia

- **Interface Geral:** `'Plus Jakarta Sans', system-ui, sans-serif`
- **Código / IDs / Logs / Webhooks:** `'JetBrains Mono', monospace`

---

## 4. Componentes Prontos & Padronizados

### 4.1 Botão Primário (Reativo ao Tema)
```tsx
<button className="px-4 py-2 text-sm font-medium text-[var(--primary-contrast)] bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer">
  {icon && <Icon className="w-4 h-4" />}
  Salvar Alterações
</button>
```

### 4.2 Botão Secundário / Neutro
```tsx
<button className="px-4 py-2 text-sm font-medium text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer">
  Cancelar
</button>
```

### 4.3 Card / Painel
```tsx
<div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] rounded-xl p-5 transition-all duration-200">
  <h3 className="text-base font-semibold text-[var(--text-main)]">Nome da Seção</h3>
  <p className="text-sm text-[var(--text-muted)] mt-1">Descrição</p>
  {children}
</div>
```

### 4.4 Campo de Input
```tsx
<input 
  type="text"
  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] rounded-lg px-3.5 py-2 text-sm text-[var(--text-main)] placeholder-[var(--text-dim)] transition-all"
  placeholder="Digite algo..."
/>
```

---

## 5. Checklist para Refatoração de Páginas com Cores Quebradas
Ao auditar ou refatorar qualquer página existente:
1. Localizar e substituir classes com valores hexadecimais brutos (`#ff801f`, `#06070a`, etc.) pelas variáveis `var(--...)`.
2. Garantir que os botões usem `text-[var(--primary-contrast)]` para ficarem legíveis tanto em temas escuros quanto claros.
3. Garantir que nenhum elemento possua `bg-white` ou `bg-black` sem adaptação de tema.

