---
name: gpi-login
description: "Automação completa do GPI (Gestão Pública Integrada) — login, navegação no menu Fluxos/Administração, criação de assuntos e operações no sistema da Prefeitura de Sooretama"
tags: [browser-harness, gpi, sooretama, automation, navegacao-gpi, assuntos, gestao-publica]
version: "1.6.0"
---

# GPI - Gestão Pública Integrada

Automação completa do sistema GPI (Gestão Pública Integrada) da Prefeitura de Sooretama — login, navegação no menu, criação de assuntos e demais operações.

**Escopo**: este skill cobre todo o fluxo operacional no GPI. As seções abaixo documentam cada operação validada. Novas operações devem ser adicionadas como subseções aqui, não como skills separadas.

## Pré-requisitos

- `browser-harness` instalado (se não estiver no PATH, use o caminho completo: `~/AppData/Roaming/Python/Python313/Scripts/browser-harness.exe`; ou instale via `uv tool install --python 3.12 --upgrade --force browser-harness`)
- Chrome com remote debugging na porta 9222
- ⚠️ **Chrome NÃO permite remote debugging com o perfil padrão** (`--user-data-dir` é obrigatório). Use um diretório temporário:
  ```
  chrome.exe --remote-debugging-port=9222 --user-data-dir="C:/Users/Alex/AppData/Local/Temp/chrome-gpi"
  ```
- Chrome **normalmente tem credenciais salvas** (auto-preenchimento) — quando usar perfil padrão, não precisa do vault
- **Quando usar perfil temporário** (remote debugging), as credenciais NÃO estão salvas. Use o vault de senhas (ver seção "Fallback: perfil Chrome temporário" abaixo)
- `pyrage` instalado (`pip install pyrage`) — necessário para descriptografar o vault
- Script `buscar_cred.py` no diretório `~/sooretama-credentials/`

## Regra fundamental de navegação

**Quando um elemento não for encontrado**: volte UMA TELA atrás (para a tela/estado conhecido anterior) e procure novamente. Nunca fique tentando no mesmo lugar. Se o clique errou o alvo, navegue de volta ao ponto conhecido e tente de novo a partir dali.

## Regra de cadastro de Assuntos no ECM

**TODO cadastro de assunto no ECM segue EXATAMENTE o mesmo passo a passo** — só muda o nome do assunto e seus dados específicos. O fluxo de navegação (Abrir > Grupo e Assunto > expandir árvore > ECM > Adicionar) e o mapeamento de campos nunca mudam.

**Se um campo específico não for encontrado** (ex: campo do formulário não achou pelo title, botão não clicou):
1. Volte para a TELA ANTERIOR conhecida (ex: listagem de Assuntos, ou menu Fluxos > Administração > Assuntos)
2. Confira se está em uma página que FAZ PARTE DO FLUXO (Fluxos > Administração > Assuntos, ou o formulário Aberto)
3. Se não estiver em uma página do fluxo → está no lugar errado. RECOMECE do início.
4. Volte ao estado conhecido e tente de novo a partir dali

## Fluxo (validado 2025-07-22)

### Login

1. **Chrome remote debugging já está configurado** (porta 9222)
2. **Navega para** `https://gpi20.cloud.el.com.br/ServerExec/acessoBase/`
3. **Aguarda carregamento do GWT** (5-10s; na primeira vez pode levar mais)
4. **Clica no botão "ENTRAR"** (role=button ou link, name="ENTRAR")
5. **Aguarda formulário de login carregar** (GWT renderiza campos dinamicamente)
6. **Credenciais JÁ ESTÃO SALVAS NO CHROME** — auto-preenchimento funciona. Só submeter com Enter.
7. **Aguarda dashboard** — título: "Administrador Geral | GPI - Gestão Pública Integrada"

#### ⚠️ Fallback: perfil Chrome temporário (sem credenciais salvas)

Quando o Chrome foi iniciado com `--user-data-dir` temporário (necessário para remote debugging), as credenciais NÃO estão salvas. Siga este fluxo alternativo:

1. **Aceite os cookies** (se aparecer): clique em "Aceitar cookies" (role=button)
2. **Clique em ENTRAR** — o formulário de login aparece
3. **Obtenha as credenciais GPI do vault**:
   ```bash
   cd ~/sooretama-credentials
   AGE_PASSPHRASE="<frase-secreta>" python buscar_cred.py "gpi"
   ```
   O vault responde com email e senha. Use o formato padrão de saída (email e senha em linhas separadas).
4. **Preencha os campos**:
   - Localize `role=textbox, name=Usuário` — clique e digite o email
   - Localize `role=textbox, name=Senha` — clique e digite a senha
5. **Clique em ENTRAR** novamente
6. Aguarde o dashboard carregar
   - Verifique: `page_info()` deve mostrar título "Administrador Geral | GPI - Gestão Pública Integrada"

> **Nota**: o script `buscar_cred.py` usa `pyrage` para descriptografar `vault.csv.age`. A frase secreta é conhecida apenas pelo usuário (Alex) — você precisará solicitá-la quando necessário.

### Navegação no Menu

O GPI renderiza menus como links inline com `▸` para submenus. A árvore é de 2 níveis:

1. **Clica no menu principal** para expandir (ex: **Fluxos**, role=link)
2. **Clica no submenu** (ex: **Administração ▸**, role=link) — expande a lista de itens
3. **Clica no item desejado** (ex: **Assuntos...**, role=link)

**Rota validada: Fluxos > Administração > Assuntos**

```
role=link, name="Fluxos"
role=link, name="Administração ▸"  ← clica para EXPANDIR (mostra subitens)
  → Participantes de Fluxos...
  → Situações...
  → Tipos de Atividades...
  → Fluxos...
  → Tipos de Assuntos...
  → Níveis de Assuntos...
  → Assuntos...              ← clica aqui
  → Agendamento de Serviços...
  → Assuntos Por Participante...
  → Espécies Documentais Por Assunto...
```

### Pesquisar assunto (OBRIGATÓRIO antes de criar)

**REGRÁ: sempre pesquise o nome do assunto antes de clicar em Abrir. Se a pesquisa retornar registros na tabela → já existe, NÃO duplicar.**

Fluxo:
1. Na tela de Assuntos (listagem), localize o campo **Pesquisar...** (role=textbox, placeholder="Pesquisar...")
2. Digite o nome do assunto exato (CAIXA ALTA)
3. Clique no botão lupa (ícone ``, role=button) para acionar a busca
4. Verifique a tabela de resultados:
   - **Se aparecer um registro na lista** (linha na grid) → assunto já existe. CANCELAR cadastro.
   - **Se a lista continuar mostrando a listagem completa ou nenhum resultado novo** → assunto NÃO existe. Pode cadastrar.
5. **IMPORTANTE**: o texto digitado aparece no campo de pesquisa mesmo sem resultados. Isso NÃO significa que existe. Só considere existente se houver uma LINHA na tabela de resultados.

### Criar Assunto (validado 2025-07-22)

**Fluxo completo: Fluxos > Administração > Assuntos > [criar]**

1. Navegue conforme rota acima (Fluxos > Administração > Assuntos)
2. Clique em **Abrir** (ícone: `+` no canto superior do grid, ao lado de "Fechar") — abre painel lateral de grupos à esquerda
3. Dentro do painel, clique em **Grupo e Assunto** (aba/painel direito) — expande árvore hierárquica de grupos
4. Expanda o grupo desejado:
   - Localize na árvore (ex: `032.00000 ECM`)
   - Clique no `+` (glyphicon-plus) à ESQUERDA do título do grupo
   - O `+` vira `-` (glyphicon-minus) quando expandido
   - Dentro aparecem os sub-assuntos já cadastrados (ex: 032.00001 LOCAÇÃO, 032.00002 RECURSO...)
   - **⚠️ Árvore longa**: com 136+ grupos, ao expandir o 032.00000 ECM os subitens podem ficar fora da viewport. O botão Adicionar precisará de scroll no container `.scroller` da árvore (NÃO `.panel-body`, NÃO `window`). O `.scroller` é um elemento com `overflowY=hidden` gerenciado por slimScroll, mas aceita `scrollTop` via JS.
5. Clique no botão **Adicionar** (no canto DIREITO do item expandido, botão com title="Adicionar", ícone fa fa-plus)
6. **Formulário "Incluindo"** abre à direita com os seguintes campos:

| Campo | Tipo | Observação |
|-------|------|-----------|
| Nível de Assunto | automático | "2 Assunto Grupo e Assunto" |
| Código do Assunto | automático | ex: "032. 00142" (sequencial) |
| Assunto* | textbox | Nome do assunto (obrigatório) |
| Descrição* | textbox | Descrição detalhada (obrigatório) |
| Classificação* | select | ex: "060 Documentação e Informação" |
| **Fluxo\*** | select | `00000 Tramitação Livre e Controlada de Protocolos` (padrão). Se Alex informar outro, usar o informado. |
| **Categoria de Tempo Previsto*** | select | **Ano(s)** (código 5). Usar a **lupa de pesquisa** ao lado do campo — NÃO digitar diretamente. |
| Tempo Previsto* | textbox | Tempo estimado |
| Palavras Chave | textbox | Palavras-chave separadas |
| Espécie Padrão* | select | Tipo de documento padrão |
| Resumo Padrão* | textbox | Resumo conciso |
| Permite Abertura Anonimamente* | select | "Não" (padrão) |
| Criar Protocolo Sigiloso | radio | Sim / Não |
| Imagem do Assunto* | select | "Nenhuma" (padrão) |
| Assunto Pai | automático | ex: "032.00000 ECM" (herdado do grupo) |
| Situação Temporal do Registro | link | Abre ficha temporal |

9. Botões de ação no topo:
   - **Fechar** (X, descarta)
   - **Salvar e Novo** (salva e abre outro formulário em branco)
   - **Salvar e Fechar** (salva e fecha o painel)
   - **Salvar** (salva e mantém aberto)

### ⚠️ Armadilha crítica: botão Adicionar overlap com header — SOLUÇÃO VALIDADA

**Problema principal:** o botão "Adicionar" (title="Adicionar") do grupo ECM frequentemente NÃO funciona porque o item da árvore está posicionado ACIMA do container `.col-lg-3` (que começa em y=148), ficando coberto por elementos do header (panel-body "Fechar" em y=83, SPAN ControllerDescription em y=58).

**✅ SOLUÇÃO VALIDADA (2025-07-23) — três passos:**

1. **Scroll corretamente o `.scroller`** para que o ECM fique DENTRO da coluna esquerda (y > 148):
   ```python
   js("document.querySelector('.scroller').scrollTop = 1300")  # ECM fica em y≈267
   ```
   ⚠️ scrollTop = 1500 coloca ECM em y=67 (coberto). scrollTop = 1300 é o valor calibrado.

2. **Force display:block no action div** e obtenha coordenadas:
   ```python
   js("""
   (function(){
       var items = document.querySelectorAll('li.list-group-item');
       for(var i=0; i<items.length; i++){
           var li = items[i];
           if(li.textContent.indexOf('032.00000 ECM') > -1){
               var action = li.querySelector('.__treeNode_action__');
               if(action) action.style.display = 'block';
           }
       }
   }())
   """)
   btn = js("""
   (function(){
       var items = document.querySelectorAll('li.list-group-item');
       for(var i=0; i<items.length; i++){
           var li = items[i];
           if(li.textContent.indexOf('032.00000 ECM') > -1){
               var addBtn = li.querySelector('button[title="Adicionar"]');
               if(addBtn){
                   var r = addBtn.getBoundingClientRect();
                   return {x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2)};
               }
           }
       }
       return null;
   }())
   """)
   ```

3. **Verifique e clique por coordenada** (NÃO use `btn.click()` JS — GWT não responde):
   ```python
   topEl = js(f"return (function(){{var el = document.elementFromPoint({btn['x']}, {btn['y']}); return el ? el.className : 'none';}})()")
   if 'fa-plus' in topEl:  # Ícone do Adicionar
       click_at_xy(btn['x'], btn['y'])
       time.sleep(4)
   ```

**Causa raiz:** a coluna esquerda (.col-lg-3) onde a árvore fica começa em y≈148. Quando o ECM está com y < 148, ele fica FORA da coluna esquerda e atrás de elementos do cabeçalho.

**Valores de scroll calibrados:**
| scrollTop | ECM y | Acessível? |
|-----------|-------|-----------|
| 1500 | y=67 | ❌ acima da coluna, coberto |
| 1530 | y=37 | ❌ mais acima, coberto por header |
| **1300** | **y=267** | **✅ SIM** |

### ⚠️ Armadilha: árvore de grupos não expande (li.click vs icon click)

Ao clicar em **"Grupo e Assunto"** para expandir a árvore:

- **✅ Confiável (138+ itens):** clicar na própria `<li>` (todo o elemento) — `li.click()` ou `click_at_xy(x, y)` no centro da li
- **❌ Inconsistente (2-4 itens apenas):** clicar no texto `<span>`, no ícone `.glyphicon-plus` via coordenadas, ou no ícone via JS click

Comportamento observado: o GPI renderiza a árvore em dois modos. Clicar na li inteira força a expansão completa dos grupos (001-136). Clicar apenas no ícone ou span pode falhar silenciosamente (apenas "A Classificar PMS" e "Grupo e Assunto" visíveis).

**Sempre verifique** `document.querySelectorAll('li.list-group-item').length` após expandir. Se < 10, a expansão falhou — tente novamente clicando na li.

### Regras de preenchimento do formulário de Assunto (valores padrão)

Quando Alex pedir para cadastrar um assunto, usar estas regras:

| Campo | Valor / Regra |
|-------|--------------|
| **Assunto*** | Nome solicitado, em **CAIXA ALTA** |
| **Descrição*** | Mesmo texto do Assunto, também **CAIXA ALTA** |
| **Resumo Padrão*** | Mesmo texto do Assunto, **CAIXA ALTA** |
| **Classificação*** | `060 Documentação e Informação` |
| **Fluxo*** | `00000 Tramitação Livre e Controlada de Protocolos` (padrão). Se Alex mencionar outro fluxo ao pedir o cadastro, usar o informado. |
| **Categoria de Tempo Previsto*** | Código `5` = **Ano(s)**. Usar a **lupa de pesquisa** (NÃO digitar diretamente). |
| **Tempo Previsto*** | `0` |
| **Palavras Chave** | Mesmo texto do Assunto (CAIXA ALTA) |
| **Espécie Padrão*** | Mesmo texto do Assunto, mas com **primeira letra de cada palavra maiúscula, exceto preposições (de, da, do, em)**. Ex: "ATESTADO DE CAPACIDADE TECNICA TI" → "Atestado de Capacidade Tecnica Ti" |
| **Assunto Pai** | Pré-preenchido (herdado do grupo expandido) |

**Se a Espécie Padrão não existir**: Alex ensinará como cadastrá-la. Aguardar instrução.

### Criar Espécie Padrão (Espécie Documental)

**Quando a Espécie Padrão pesquisada não for encontrada**, Alex instrui a sequência: três pontinhos → + → preencher → Salvar e Fechar.

**Fluxo completo:**

1. **Com o formulário de Assunto aberto**, localize o campo **Espécie Padrão\*** (SuggestBox)
2. Ao lado do input, há dois botões:
   - **Lupa** (fa-search, title='Abre uma lista...') — abre lista de pesquisa
   - **Três pontinhos** (fa-ellipsis-h, title='') — abre menu de contexto
3. **Clique nos três pontinhos** (direita da lupa, ~30px separação)
4. Um popup aparece com 3 botões:
   - 📋 (fa-list) — "Caso algum registro esteja selecionado..."
   - ✏️ (fa-pencil) — "Caso algum registro esteja selecionado..."
   - **➕ (fa-plus)** — "Direciona para uma janela com opções ava..."
5. **Clique no ➕ (fa-plus)** — abre tela **ECM > Administração > Espécies Documentais**
6. Na tela de Espécies Documentais, clique em **"Novo"** (botão fa-plus-circle no topo, ao lado de "Fechar")
7. **Formulário de Cadastro de Espécie Documental** abre com campos:

| Campo | Tipo | Observação |
|-------|------|-----------|
| Cliente | auto | "PREFEITURA MUNICIPAL DE SOORETAMA" |
| Código | auto | Ex: "8448" (sequencial) |
| Nome | text | Nome da espécie (obrigatório) |
| Descrição | textarea | Detalhes da espécie |
| Classificação | select (preenchido) | Ex: "060.0 Documentação e Informação" |
| Tempo de Arquivo Corrente | campos numéricos | "0"+"0" (padrão) |
| Destinação Final | select | "Guarda Permanente" (já selecionado) |
| Tipo | select | "ECM" (padrão) |
| Tipo de Certidão | select | "Não se Aplica 0" |
| Classificação de Habilitação | select | "Não se Aplica" |
| Arquivo | select | "30 MB" (já selecionado) |

8. **Regras de preenchimento** (segundo instrução de Alex):

| Campo | Valor |
|-------|-------|
| **Nome** | Texto do Assunto, em **Caixa Alta e Baixa** (ex: "Atestado de Capacidade Tecnica Ti") |
| **Descrição** | Mesmo texto do Nome |
| **Classificação** | Já preenchido: "060.0 Documentação e Informação" |
| **Destinação Final** | Já preenchido: "Guarda Permanente" |
| **Arquivo** | Já preenchido: "30 MB" |

   ⚠️ **A maioria dos campos já vem pré-preenchida com os valores corretos** — só precisa digitar Nome e Descrição.

9. **Selecionar a espécie de volta no formulário de Assunto**:
   - Após Salvar e Fechar, o modal de Espécies Documentais fecha e volta para o modal anterior
   - O modal anterior pode mostrar a **árvore de grupos** (painel esquerdo) em vez do formulário de Assunto
   - Se isso acontecer, pode precisar descartar alterações e **recomeçar** o cadastro do Assunto
   - Na segunda tentativa, a Espécie já existe: digite o nome no campo Espécie Padrão, aguarde sugestões, e selecione a opção

**Botões de ação do formulário de Espécie Documental:**
- **Salvar** — salva e mantém aberto
- **Salvar e Fechar** — salva e fecha o formulário (volta para lista de espécies)
- **Salvar e Novo** — salva e abre novo formulário em branco
- **Fechar** — descarta alterações

**Armadilhas:**
- A Classificação, Destinação Final e Arquivo geralmente já vêm pré-preenchidos — **não altere**
- O Nome deve estar no formato **Caixa Alta e Baixa** (não CAIXA ALTA como no Assunto)
- Após criar a espécie, é necessário fechar o modal de Espécies Documentais e **reabrir o formulário de Assunto** para selecionar a nova espécie

**Se a Classificação 060 não for encontrada no select**: avisar Alex para instruir o próximo passo.

### ⚠️ Armadilha: scroll e botões do cabeçalho

Os botões de ação (Salvar, Salvar e Fechar, Fechar) ficam no **topo do modal** (y≈105). A página pode estar scrollada, fazendo com que esses botões fiquem **fora da viewport**:

- Verifique `page_info()` → `sy` (scroll y)
- Se `sy > 50`, faça `js("window.scrollTo(0, 0)")` antes de clicar nos botões de ação
- Caso contrário, o clique vai para o lugar errado e o botão não responde
- **Sempre verifique as coordenadas dos botões na sessão atual** antes de clicar

### ✅ Categoria de Tempo Previsto — Solução validada: usar lupa de pesquisa

O campo **Categoria de Tempo Previsto** é um GWT SuggestBox que **NÃO aceita digitação direta via JavaScript** — nem `inp.value = "5"`, nem `inp.value = "Ano(s)"`. O valor é sempre revertido pelo widget.

**✅ Solução validada (2025-07-23): usar o botão "Abrir lista" (lupa) ao lado do campo.**

**Opções disponíveis no popup:**
| Código | Categoria |
|--------|-----------|
| 5 | Ano(s) |
| 3 | Dia(s) |
| 2 | Hora(s) |
| 4 | Mes(es) |
| 1 | Minuto(s) |

**Passo a passo:**
1. Localize o input da Categoria (title="Escolha o tipo de classificação temporal associado", y≈500, x≈856)
2. Clique no botão **lupa** à direita do input (coordenadas ≈ (1225, 517), title="Abrir lista", classe `btn btn-default`, ícone `fa fa-search`)
3. Aguarde 2-3s — abre popup GWT com tabela de opções
4. Clique na linha desejada (ex: "5 | Ano(s)" ≈ (1155, 578))
5. O popup fecha e o campo fica com o valor "Ano(s)" (aceito pelo sistema)

**Código exemplo:**
```python
click_at_xy(1225, 517)  # Abrir popup
time.sleep(2.5)
js("""
(function(){
    var popup = document.querySelector('.gwt-SuggestBoxPopup');
    var allDivs = popup.querySelectorAll('div, td');
    for(var i=0; i<allDivs.length; i++){
        var d = allDivs[i];
        var txt = d.textContent.trim();
        if(txt.indexOf('5') > -1 && txt.indexOf('Ano') > -1 && txt.length < 20){
            var tr = d.closest('tr');
            if(tr){ tr.click(); return 'clicked'; }
            d.click(); return 'clicked';
        }
    }
    return 'not found';
}())
""")
time.sleep(2)
```

**Observações:**
- O mesmo padrão de lupa se aplica a outros campos SuggestBox (Fluxo, Classificação, Espécie Padrão). A diferença é que Fluxo e Classificação ACEITAM digitação direta, enquanto Categoria NÃO.
- O botão "Abrir lista" NÃO fecha o formulário quando clicado no contexto correto (formulário Incluindo, scroll correto). O problema de fechar o formulário acontecia quando a página estava em estado corrompido.

**Crucial — matching de título com caracteres acentuados:**
O title do campo Categoria é "Escolha o tipo de **classificação** temporal associado" (com ç e ã).
```python
# ❌ ERRADO — não encontra:
title.indexOf('classificacao temporal')  # -1

# ✅ CORRETO:
title.indexOf('classifica')  # funciona sem acentos
```

### Dicas de interação com campo SuggestBox (select/dropdown)

Campos como Fluxo, Classificação, Categoria de Tempo Previsto e Espécie Padrão são **GWT SuggestBoxes**, não selects HTML nativos. O comportamento é:

**Fluxo para interagir:**
1. **Foque o input** do SuggestBox (role=textbox, dentro de uma table com `<input>`)
2. **Digite texto** que corresponda à opção desejada (ex: "00000 Tramitação" para Fluxo). O valor parcial já dispara o popup de sugestões automaticamente.
3. **Aguarde o `.gwt-SuggestBoxPopup`** aparecer (pode levar 1-2s)
4. **Localize e clique na opção** dentro do popup via JS:
   ```python
   result = js("""
   (function(){
       var popup = document.querySelector('.gwt-SuggestBoxPopup');
       if(popup){
           var items = popup.querySelectorAll('.item, .suggestItem, td');
           for(var i=0; i<items.length; i++){
               var item = items[i];
               if(item.textContent.indexOf('00000') > -1 && item.textContent.indexOf('Tramitação') > -1){
                   item.click();
                   return {clicked: true};
               }
           }
       }
       return {clicked: false};
   }())
   """)
   ```

**Armadilha crítica — popup persistente:**
- O SuggestBoxPopup **NÃO fecha automaticamente** quando você muda de campo
- Se você abriu sugestões para Fluxo e depois clicou em outro campo, o popup ainda está visível e vai interceptar cliques
- **Sempre feche popups antes de interagir com outro campo:** `js("document.body.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true}))")`
- Ou force remoção: `js("document.querySelectorAll('.gwt-SuggestBoxPopup, .gwt-PopupPanel').forEach(p => p.style.display='none')")`

**Se as sugestões não aparecem:**
- Verifique se o `document.activeElement` é realmente o `<input>` do SuggestBox
- Se o activeElement for um `<div>`, o foco não foi transferido corretamente
- Use `inp.focus()` + `inp.dispatchEvent(new Event('input', {bubbles:true}))` via JS

**Espécie Padrão — se não encontrada:**
- Se a busca retornar `"Não foram encontrados registros na pesquisa"` → espécie não existe
- Deixe o valor digitado no campo e aguarde instrução de Alex para cadastrar nova

### Identificação de campos do formulário via atributo title

Campos GWT são renderizados dentro de elementos com atributo `title` contendo uma descrição única. **Use o `closest('[title]')` como identificador**, não backendNodeId (muda a cada refresh) nem position y (pode variar com scroll).

```python
# Identificar campo por tooltip title
result = js("""
(function(target){
    var inputs = document.querySelectorAll('input, textarea');
    for(var i=0; i<inputs.length; i++){
        var el = inputs[i];
        var p = el.closest('[title]');
        if(p && p.title.indexOf(target) > -1){
            var r = el.getBoundingClientRect();
            return {found: true, x: r.left + r.width/2, y: r.top + r.height/2, value: el.value};
        }
    }
    return {found: false};
})(arguments[0])
""", title_contains)
```

**Títulos conhecidos para cada campo (mapeamento validado 2025-07-22):**
| Title (parcial, inicio) | Campo | Tipo HTML |
|--------------------------|-------|-----------|
| "Digite o nome descritivo" | **Assunto*** | `<input type="text">` |
| "Forneça uma explicação completa" | **Descrição*** | `<textarea>` |
| "Escolha a categoria ou classificação" | **Classificação*** | `<input>` (SuggestBox) |
| "Selecione o fluxo específico" | **Fluxo*** | `<input>` (SuggestBox) |
| "Escolha o tipo de classificação temporal" | **Categoria de Tempo Previsto*** | `<input>` (SuggestBox) |
| "Indique o tempo estimado" | **Tempo Previsto*** | `<input type="text">` |
| "Forneça as palavras-chave" | **Palavras Chave** | `<textarea>` |
| "Selecione o tipo de documento" | **Espécie Padrão*** | `<input>` (SuggestBox) |
| "Forneça um resumo conciso" | **Resumo Padrão*** | `<textarea>` |
| "Indique se o assunto pode ser utilizado" | **Permite Abertura Anonimamente*** | `<input>` (SuggestBox) |
| "Escolha uma imagem" | **Imagem do Assunto*** | `<input>` (SuggestBox) |
| "Neste campo é informado a categoria principal" | **Assunto Pai** | `<input>` (disabled, auto) |

**⚠️ Atenção especial para acentos no title:**
O GPT usa caracteres acentuados nos titles ("classificação", "explicação"). `indexOf` é CASE-SENSITIVE e ACENTO-SENSITIVE em JavaScript:
```python
# ❌ ERRADO — não encontra:
title.indexOf('classificacao temporal')  # -1 (sem cedilha/acento)

# ✅ CORRETO (busca parcial, sem acentos no suffix):
title.indexOf('classifica')  # > -1, funciona
title.indexOf('classificação')  # > -1, funciona se usar acentos

# Padrão seguro para todos os campos:
title.indexOf('explica')  # matches "explicação" e "explicacao"
title.indexOf('palavras')  # matches "palavras-chave"
title.indexOf('temporal')  # matches "classificação temporal"
```

### Clicando em ícones de árvore GWT

Ícones expand/retract e Adicionar podem não aparecer na Accessibility Tree. Use JavaScript para localizá-los:

```python
# Exemplo: clicar no + para expandir 032.00000 ECM
coords = js("""
    const items = document.querySelectorAll('li.list-group-item');
    for (const li of items) {
        if (li.textContent.includes('032.00000 ECM')) {
            const el = li.querySelector('.glyphicon-plus');
            if (el) {
                const rect = el.getBoundingClientRect();
                return {x: rect.left + rect.width/2, y: rect.top + rect.height/2, found: true};
            }
        }
    }
    return {found: false};
""")
if coords.get('found'):
    click_at_xy(coords['x'], coords['y'])

# Exemplo: clicar no botão Adicionar (title="Adicionar")
coords = js("""
    const items = document.querySelectorAll('li.list-group-item');
    for (const li of items) {
        if (li.textContent.includes('032.00000 ECM')) {
            const btn = li.querySelector('button[title="Adicionar"], .fa-plus');
            if (btn) {
                const rect = btn.getBoundingClientRect();
                return {x: rect.left + rect.width/2, y: rect.top + rect.height/2, found: true};
            }
        }
    }
    return {found: false};
""")
```

### Fallback quando algo não funciona

**Sessão expirou** (título "Error" / "Forbidden"):
1. Volte para URL base: `https://gpi20.cloud.el.com.br/ServerExec/acessoBase/`
2. Se ainda logado, a sessão restaura automaticamente
3. Se não, refaça o login (botão ENTRAR está na página)

**backendNodeId não encontrado no AX tree**:
1. GWT recria elementos dinamicamente — IDs mudam a cada refresh
2. Sempre refaça `cdp("Accessibility.getFullAXTree")["nodes"]` na sessão ATUAL
3. Use `role` + `name` como critério, nunca backendNodeIds fixos
4. Se ainda não achar, liste todos `link`/`button` para debug

**Clique não funcionou / navegou pro lugar errado / formulário ficou com valores corrompidos**:
1. Volte para a tela conhecida anterior (ex: tela de listagem de Assuntos)
2. Refaça o caminho a partir dali: Abrir → Grupo e Assunto → expandir grupo → Adicionar
3. Nunca tente repetidamente no mesmo lugar quando algo claramente errou

**Botão Adicionar não aparece ou está em x=0 y=0**:
- O botão Adicionar fica em `.__treeNode_action__` que tem `display:none` por padrão
- O botão só fica visível quando o mouse passa sobre o item da árvore, ou quando você força via JS
- **Solução**: use JavaScript para mostrar e clicar:
  ```python
  js("""
  (function(){
      var items = document.querySelectorAll('li.list-group-item');
      for(var li of items){
          if(li.textContent.includes('032.00000 ECM')){
              var actions = li.querySelector('.__treeNode_action__');
              if(actions) actions.style.display = 'block';
              var btn = actions?.querySelector('button');
              if(btn) btn.click();
          }
      }
  }())
  """)
  ```
- Se as coordenadas retornam x=0, y=0 mesmo com display:block, o item está **fora da viewport**. Role o container da árvore (`.scroller`, não `window`):\n  ```python\n  js("document.querySelector('.scroller')?.scrollTo(0, 1500)")\n  # ou\n  js("""document.querySelectorAll('li.list-group-item').forEach(function(li){\n      if(li.textContent.includes('032.00000 ECM')){\n          var btn = li.querySelector('button');\n          if(btn) btn.scrollIntoView({block:'center'});\n      }\n  })""")\n  ```

## Código de referência (helpers)

```python
# Clicar via backendNodeId (confiável para elementos do AX tree)
def click_node(bid):
    box = cdp("DOM.getBoxModel", backendNodeId=bid)["model"]["content"]
    x = sum(box[0::2]) / 4
    y = sum(box[1::2]) / 4
    click_at_xy(x, y)
    wait_for_load()

# Buscar elemento por role + name parcial
def find_element(role, name_contains):
    nodes = cdp("Accessibility.getFullAXTree")["nodes"]
    for n in nodes:
        name = (n.get("name", {}).get("value") or "").lower()
        r = n.get("role", {}).get("value")
        if r == role and name_contains.lower() in name:
            return n
    return None

# Listar links/botoes para debug
def list_links():
    for n in cdp("Accessibility.getFullAXTree")["nodes"]:
        name = n.get("name", {}).get("value", "")
        role = n.get("role", {}).get("value", "")
        if role in ("link", "button") and name:
            print(f"role={role}, name={name[:60]}, bid={n.get('backendDOMNodeId')}")
```

## Vault de credenciais

O vault (`~/sooretama-credentials/vault.csv.age`) tem formato CSV:
```
name,email,password
```

**Uso normal**: credenciais do GPI estão salvas no Chrome — não precisa do vault.

**Uso com perfil temporário**: quando o Chrome foi iniciado com `--user-data-dir` não-padrão (exigência do remote debugging), as credenciais não estão salvas. Use o script `buscar_cred.py`:

```bash
cd ~/sooretama-credentials
AGE_PASSPHRASE="<frase-secreta>" python buscar_cred.py "gpi"
```

Isso retorna as credenciais no formato:
```
email: <email>
senha: <senha>
```