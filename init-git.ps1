# Inicializar Git e preparar para deploy
Write-Host "🚀 Preparando Radial Training para Deploy no Render..." -ForegroundColor Cyan

# 1. Verificar se Git está instalado
try {
    git --version | Out-Null
    Write-Host "✅ Git instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado. Instale em: https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# 2. Inicializar Git
if (!(Test-Path .git)) {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositório Git já existe" -ForegroundColor Green
}

# 3. Adicionar todos os arquivos
Write-Host "📝 Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# 4. Verificar status
Write-Host "`n📊 Status do repositório:" -ForegroundColor Cyan
git status

# 5. Fazer commit inicial
Write-Host "`n💾 Fazendo commit inicial..." -ForegroundColor Yellow
$commitMessage = "Sistema Radial Training - Deploy inicial para Render"
git commit -m $commitMessage

Write-Host "`n✅ Repositório preparado!" -ForegroundColor Green
Write-Host "`n📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Criar repositório no GitHub: https://github.com/new" -ForegroundColor White
Write-Host "   Nome sugerido: radial-training" -ForegroundColor Gray
Write-Host "`n2. Executar os comandos que o GitHub mostrar:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/SEU_USUARIO/radial-training.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "`n3. Deploy no Render:" -ForegroundColor White
Write-Host "   - Acesse: https://render.com/" -ForegroundColor Gray
Write-Host "   - New > Web Service" -ForegroundColor Gray
Write-Host "   - Conecte seu repositório GitHub" -ForegroundColor Gray
Write-Host "   - Deploy automático! 🎉" -ForegroundColor Gray
Write-Host "`n📖 Leia o arquivo DEPLOY-RENDER.md para mais detalhes" -ForegroundColor Yellow
