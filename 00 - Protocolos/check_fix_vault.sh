cat << 'EOF' > /tmp/check_fix_vault.sh
#!/bin/bash
VAULT_DIR="${VAULT_DIR:-/E/CofreObsidian}"
[ ! -d "$VAULT_DIR" ] && VAULT_DIR="E:/CofreObsidian"
[ ! -d "$VAULT_DIR" ] && VAULT_DIR="$HOME/CofreObsidian"

echo "══════════════════════════════════════════════════════"
echo "   DIAGNÓSTICO E AUTOCORREÇÃO: HERMES AGENT & GIT"
echo "══════════════════════════════════════════════════════"
echo ""

# 1. Configurar ~/.ssh e permissões
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

# Detectar chave SSH existente
KEY_FILE=""
for k in "$HOME/.ssh/hermes-ct" "$HOME/.ssh/id_ed25519" "$HOME/.ssh/id_rsa"; do
    if [ -f "$k" ]; then
        KEY_FILE="$k"
        chmod 600 "$k"
        break
    fi
done

# Configurar ~/.ssh/config se necessário
if [ -n "$KEY_FILE" ]; then
    if ! grep -q "IdentityFile $KEY_FILE" "$HOME/.ssh/config" 2>/dev/null; then
        echo -e "\nHost github.com\n  HostName github.com\n  User git\n  IdentityFile $KEY_FILE\n  IdentitiesOnly yes\n  StrictHostKeyChecking accept-new" >> "$HOME/.ssh/config"
        chmod 600 "$HOME/.ssh/config"
        echo "🔧 [Autocorreção] ~/.ssh/config atualizado com a chave: $(basename "$KEY_FILE")"
    fi
fi

# 2. Testar Conexão SSH com GitHub
echo -n "🔑 Conexão SSH com GitHub: "
SSH_TEST=$(ssh -T -o StrictHostKeyChecking=accept-new git@github.com 2>&1)
if echo "$SSH_TEST" | grep -qi "successfully authenticated"; then
    echo "✅ AUTENTICADO COM SUCESSO"
else
    echo "❌ FALHA NA AUTENTICAÇÃO"
    echo "   Detalhe: $SSH_TEST"
    if [ -f "$KEY_FILE.pub" ]; then
        echo "   📋 Sua chave pública atual é:"
        cat "$KEY_FILE.pub"
    fi
fi

# 3. Verificar Diretório do Cofre
echo -n "📁 Diretório do Cofre ($VAULT_DIR): "
if [ -d "$VAULT_DIR" ]; then
    echo "✅ ENCONTRADO"
    cd "$VAULT_DIR" || exit 1
else
    echo "⚠️  NÃO ENCONTRADO no caminho padrão"
fi

# 4. Verificar e Corrigir Git Remote
if [ -d "$VAULT_DIR/.git" ]; then
    CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null)
    TARGET_REMOTE="git@github.com:Alexbsbb/obsidian-vault.git"
    
    echo -n "🔄 Git Remote: "
    if [ "$CURRENT_REMOTE" = "$TARGET_REMOTE" ]; then
        echo "✅ SSH CONFIGURADO ($CURRENT_REMOTE)"
    else
        echo "⚠️  Atualizando de '$CURRENT_REMOTE' para '$TARGET_REMOTE'..."
        git remote set-url origin "$TARGET_REMOTE"
        echo "   🔧 [Autocorreção] Remote atualizado para SSH!"
    fi

    # 5. Testar Git Fetch / Permissão de Acesso
    echo -n "📡 Teste de Git Fetch: "
    if git fetch origin main > /dev/null 2>&1 || git fetch origin > /dev/null 2>&1; then
        echo "✅ COMUNICAÇÃO GIT BEM-SUCEDIDA"
    else
        echo "❌ ERRO AO FAZER FETCH"
    fi
fi

# 6. Testar Escrita e Leitura
echo -n "✍️  Permissão de I/O (Leitura/Escrita): "
mkdir -p "$VAULT_DIR/Memórias" 2>/dev/null
TEST_F="$VAULT_DIR/Memórias/_test_hermes_perm.tmp"
if echo "ok" > "$TEST_F" 2>/dev/null && rm "$TEST_F" 2>/dev/null; then
    echo "✅ PERMISSÃO TOTAL (I/O OK)"
else
    echo "❌ ERRO DE PERMISSÃO DE ESCRITA"
fi

echo ""
echo "══════════════════════════════════════════════════════"
echo "   DIAGNÓSTICO CONCLUÍDO"
echo "══════════════════════════════════════════════════════"
EOF
chmod +x /tmp/check_fix_vault.sh
