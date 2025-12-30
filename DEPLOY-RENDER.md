# 🚀 Deploy no Render.com - Radial Training

## 📋 Passo a Passo

### 1️⃣ Preparar Repositório GitHub

```bash
# Inicializar Git (se ainda não tiver)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Sistema Radial Training - Deploy inicial"

# Criar repositório no GitHub
# Vá em: https://github.com/new
# Nome sugerido: radial-training

# Conectar e enviar
git remote add origin https://github.com/SEU_USUARIO/radial-training.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy no Render

1. **Criar conta:** https://render.com/
2. **New > Web Service**
3. **Conectar GitHub** e selecionar repositório `radial-training`
4. Render detectará automaticamente o `render.yaml`
5. **Deploy automático!**

### 3️⃣ Configuração Adicional (Opcional)

#### Domínio Personalizado:
- Settings > Custom Domain
- Adicionar: `training.radial.com.br`
- Configurar DNS no seu provedor

#### Variáveis de Ambiente:
Já configuradas no `render.yaml`, mas você pode adicionar:
- `ADMIN_PASSWORD` - Senha para admin
- `EMAIL_HOST` - Para envio de emails

### 4️⃣ Banco de Dados SQLite

O Render usa **disco persistente** configurado:
- Path: `/opt/render/project/src/data`
- Tamanho: 1GB (gratuito)
- Backups manuais disponíveis

### ⚡ Comandos Git Úteis

```bash
# Atualizar o sistema após mudanças
git add .
git commit -m "Atualização do sistema"
git push

# Render fará deploy automático!
```

### 🔒 Segurança

✅ HTTPS automático  
✅ Backups via Render Dashboard  
✅ Logs de acesso disponíveis  
✅ Reinicialização automática  

### 📊 Monitoramento

- **Dashboard:** render.com/dashboard
- **Logs:** Tempo real no Render
- **Métricas:** CPU, memória, requests

### 💰 Plano Free Limits

- ✅ 750 horas/mês (suficiente!)
- ✅ 1GB disco persistente
- ✅ Deploy automático via Git
- ⚠️ Dorme após 15min inatividade
- ⚠️ Demora ~30s para acordar

### 🔄 Manter Ativo (Opcional)

Use serviço gratuito de ping:
- **UptimeRobot:** https://uptimerobot.com/
- Fazer ping a cada 14 minutos

---

## 🆘 Problemas Comuns

**Erro no build:**
```bash
npm install
```

**Banco não persiste:**
- Verificar se disco está montado em Settings

**Certificados não aparecem:**
- Ajustar path para `/opt/render/project/src/uploads`

---

## 📞 Suporte

- Render Docs: https://render.com/docs
- GitHub Issues: No seu repositório
