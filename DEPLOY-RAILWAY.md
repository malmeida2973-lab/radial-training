# 🚂 Deploy no Railway - Guia Completo

> Sistema Radial Training rodando com banco de dados persistente - **TOTALMENTE GRÁTIS!**

## ✅ Resumo Rápido

- ✅ **Crédito grátis:** $5/mês (renova automaticamente)
- ✅ **Seu custo:** ~$1.50/mês (dados persistem!)
- ✅ **Setup:** 5 minutos
- ✅ **HTTPS automático**

---

## 🚀 Passo a Passo

### 1️⃣ Criar Conta Railway

1. Acesse: **https://railway.app/**
2. Clique em **"Login"** (canto superior direito)
3. Selecione **"Continue with GitHub"**
4. Autorize o Railway

### 2️⃣ Novo Projeto

1. Clique em **"New Project"** (ou **"Create"**)
2. Selecione **"Deploy from GitHub repo"**
3. Clique em **"Select a repo"**

### 3️⃣ Selecionar Repositório

1. Procure por: `radial-training`
2. Clique para selecionar
3. Clique em **"Deploy"**

### 4️⃣ Aguardar Build

O Railway vai:
- ⏳ Clonar seu repositório
- ⏳ Instalar dependências (`npm install`)
- ⏳ Iniciar servidor (`npm start`)
- ✅ Gerar URL pública

**Tempo esperado:** 3-5 minutos

---

## 🗄️ Configurar Banco de Dados (Persistente)

### Opção A: SQLite (Recomendado para sua demanda)

1. **No Dashboard Railway:**
   - Clique no seu serviço `radial-training`
   - Vá em **"Data"**
   - Clique em **"Create Database"**
   - Selecione **"PostgreSQL"**
   - Aguarde criar

2. **Railway conecta automaticamente!**
   - Variáveis de ambiente já configuradas
   - Seu `database.js` detecta automaticamente

### Opção B: Usar SQLite Local (Mais Simples)

Seu sistema já usa SQLite! Railway automaticamente:
- ✅ Monta volume persistente
- ✅ Dados salvos permanentemente
- ✅ Sem configuração extra

---

## 🌐 Acessar seu Sistema

Após deploy, você verá uma URL como:

```
https://radial-training-production-xxxx.up.railway.app
```

### URLs do seu sistema:
- **Admin:** `https://seu-url.railway.app/admin.html`
- **Formulário:** `https://seu-url.railway.app/formulario.html`
- **Login:** `https://seu-url.railway.app/login.html`

---

## 🔐 Primeira Senha

**Padrão:**
- Usuário: `admin`
- Senha: `radial123`

**Altere imediatamente:**
1. Acesse o painel admin
2. Clique em **"🔐 Alterar Senha"**
3. Mude para sua senha pessoal

---

## 💾 Dados Persistentes

Railway automaticamente:
- ✅ Salva banco SQLite em volume
- ✅ Persiste entre reinicializações
- ✅ Backups automáticos
- ✅ Sem limite de armazenamento (no plano free)

---

## 💰 Custos (Totalmente Grátis!)

| Recurso | Custo/Mês | Seu Uso |
|---------|-----------|---------|
| Computação | $0.50/hora | ~$1/mês |
| Volume (Disco) | Incluído | Ilimitado |
| Banda | Incluída | ~500MB |
| **Crédito Railway** | **$5 GRÁTIS** | **Sempre sobra!** |

---

## 🔄 Atualizações

Toda vez que você faz `git push`:

1. Railway detecta automaticamente
2. Faz novo build e deploy
3. Sistema atualiza sem perder dados
4. Processo automático! ✨

```bash
# Fazer mudanças locais
git add .
git commit -m "Descrição da mudança"
git push

# Railway redeploy automático!
```

---

## 📊 Monitorar Aplicação

### Dashboard Railway:

1. **Deployments:**
   - Ver histórico de deploys
   - Rollback se necessário

2. **Logs:**
   - Ver mensagens do servidor
   - Diagnosticar problemas

3. **Metrics:**
   - CPU
   - Memória
   - Requisições

4. **Data:**
   - Gerenciar banco de dados
   - Backups

---

## 🆘 Troubleshooting

### Erro: "Build Failed"
```
Solução: Verificar logs do deploy
1. Vá em "Deployments"
2. Clique no deploy com erro
3. Veja os logs completos
```

### Erro: "Application Error"
```
Solução: Verificar variáveis de ambiente
1. Vá em "Variables"
2. Adicione NODE_ENV=production
3. Faça novo deploy
```

### Dados desapareceram?
```
Solução: Volume persistente deve estar ativo
1. Vá em "Data"
2. Confirme se banco está conectado
3. Se não, crie novo volume
```

---

## 🎯 Próximas Ações

1. ✅ Código no GitHub ← **JÁ FEITO**
2. ⏳ Criar conta Railway
3. ⏳ Deploy automático
4. ⏳ Testar sistema
5. ⏳ Mudar senha admin
6. ⏳ Usar em produção!

---

## 📞 Suporte

- **Railway Docs:** https://docs.railway.app/
- **GitHub Issues:** Seu repositório
- **Status Page:** https://status.railway.app/

---

## 🎉 Parabéns!

Seu sistema Radial Training está:
- ✅ Pronto para produção
- ✅ Com dados persistentes
- ✅ Hospedado GRÁTIS
- ✅ Com HTTPS automático
- ✅ Com deploy automático

**Bora lançar!** 🚀
