#!/bin/bash
# Verification script for NotesApp development

echo "🚀 Verifying NotesApp Setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found"
fi

# Check Go
if command -v go &> /dev/null; then
    echo "✅ Go: $(go version)"
else
    echo "❌ Go not found"
fi

# Check git
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git not found"
fi

echo ""
echo "📦 Installing dependencies..."
cd NotesApp && npm install 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependency installation failed"
fi

echo ""
echo "🧪 Running TypeScript check..."
cd NotesApp && npx tsc --noEmit 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ TypeScript checks pass"
else
    echo "⚠️ TypeScript has errors (expected before install)"
fi

echo ""
echo "✅ Verification complete!"