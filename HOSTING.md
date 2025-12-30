# Guia de Hospedagem - Sistema de Treinamentos Radial

## 📋 Resumo das Opções

Este documento apresenta as melhores opções de hospedagem **gratuita ou barata** para o Sistema de Treinamentos Radial.

---

## 1. **Render** ⭐ (Recomendado - GRATUITO)

### Características:
- ✅ **Tier Gratuito**: 750 horas/mês (suficiente para uso contínuo)
- ✅ **Banco de Dados**: PostgreSQL grátis (limite: 256MB)
- ✅ **Deploy automático**: Git integrado
- ✅ **Suporte SSL**: Incluído
- ✅ **Fácil de usar**: Interface intuitiva

### Desvantagens:
- ❌ Dormência após 15 minutos sem tráfego (reativa automaticamente)
- ❌ Limite de 256MB para banco de dados

### Como Deployar:

1. Criar conta em https://render.com
2. Conectar repositório GitHub
3. Criar novo "Web Service"
4. Selecionar branch `main`
5. Configurar:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: `NODE_ENV=production`

### Custo: **R$ 0,00/mês**

---

## 2. **Railway.app** (Alternativa - GRATUITO)

### Características:
- ✅ **Tier Gratuito**: $5 crédito/mês
- ✅ **Banco de Dados**: PostgreSQL disponível
- ✅ **Deploy**: Via Git ou CLI
- ✅ **Simplicidade**: Muito fácil de usar

### Desvantagens:
- ❌ Crédito limitado (geralmente cobre 1 app pequeno)
- ❌ Sem banco de dados gratuito separado

### Como Deployar:

1. Criar conta em https://railway.app
2. Conectar GitHub
3. Clicando em "New Project" > "GitHub Repo"
4. Selecionar repositório
5. Railway detecta automaticamente configurações Node.js

### Custo: **R$ 0,00/mês** (com créditos inclusos)

---

## 3. **Vercel** (Para Frontend - GRATUITO)

### Características:
- ✅ **Tier Gratuito**: Excelente para aplicações estáticas
- ✅ **Deploy automático**: Do GitHub
- ✅ **Performance**: CDN global
- ⚠️ **Backend limitado**: Serverless functions com restrições

### Desvantagens:
- ❌ Não suporta banco de dados SQLite persistente
- ❌ Melhor para frontend estático

### Não Recomendado para: Este projeto (necessita backend persistente)

### Custo: **R$ 0,00/mês**

---

## 4. **Heroku** (Descontinuado - Não Recomendado)

⚠️ **A Heroku descontinuou seu plano gratuito em 28 de Novembro de 2022**

---

## 5. **Oracle Cloud Free Tier** (GRATUITO COM LIMITE)

### Características:
- ✅ **Tier Permanentemente Gratuito**
- ✅ **Computação**: 2 vCPU, 1GB RAM
- ✅ **Banco de Dados**: MySQL 8.0 grátis
- ✅ **Armazenamento**: 10GB grátis
- ✅ Suporte SSH/Terminal

### Desvantagens:
- ❌ Exigir cartão de crédito
- ❌ Limite de recursos (2 vCPU, 1GB RAM)
- ❌ Configuração mais técnica

### Como Deployar:

1. Criar conta em https://oracle.com/cloud/free
2. Criar uma instância Linux (Always Free)
3. SSH para a máquina
4. Instalar Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
5. Clonar repositório: `git clone <seu-repo>`
6. Instalar dependências: `npm install`
7. Iniciar com PM2 (para manter rodando):
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "treinamentos" -- start
   pm2 startup
   pm2 save
   ```

### Custo: **R$ 0,00/mês** (com restrições)

---

## 6. **Replit** (Desenvolvimento - GRATUITO)

### Características:
- ✅ **Tier Gratuito**: Bom para desenvolvimento
- ✅ **Deploy automático**: Integrado
- ✅ **IDE Web**: Sem configuração necessária
- ✅ **Simples**: Ideal para iniciantes

### Desvantagens:
- ❌ Performance limitada
- ❌ Dormência em inatividade
- ❌ Limite de tempo de execução

### Custo: **R$ 0,00/mês**

---

## 7. **AWS Free Tier** (Complexo - GRATUITO COM LIMITE)

### Características:
- ✅ **Tier Gratuito**: 12 meses ou permanente para alguns serviços
- ✅ **EC2**: 750 horas/mês máquina t2.micro
- ✅ **RDS**: 750 horas MySQL grátis
- ✅ **S3**: 5GB armazenamento

### Desvantagens:
- ❌ Muito complexo de configurar
- ❌ Documentação densa
- ❌ Fácil exceder limites gratuitamente

### Não Recomendado para: Iniciantes

---

## 📊 Comparação Rápida

| Plataforma | Custo | Facilidade | Performance | Banco de Dados |
|-----------|-------|-----------|-------------|----------------|
| **Render** | Grátis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | PostgreSQL |
| **Railway** | Grátis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | PostgreSQL |
| **Oracle Cloud** | Grátis | ⭐⭐⭐ | ⭐⭐⭐⭐ | MySQL |
| **Replit** | Grátis | ⭐⭐⭐⭐⭐ | ⭐⭐ | SQLite |
| **Vercel** | Grátis | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ Não |
| **AWS** | Grátis | ⭐⭐ | ⭐⭐⭐⭐⭐ | Múltiplas |

---

## 🚀 Recomendação Final

### **Para Iniciantes**: **Render** ou **Railway**
- Deploy em 5 minutos
- Sem complexidade desnecessária
- Performance adequada
- Totalmente gratuito

### **Para Melhor Custo-Benefício**: **Oracle Cloud**
- Recursos melhores
- Completamente gratuito
- Mais controle
- Exige um pouco mais de configuração

### **Para Testes Rápidos**: **Replit**
- IDE integrada
- Zero configuração
- Deploy instantâneo

---

## 📝 Passos para Deploy no Render (Passo a Passo)

### 1. Preparar o Repositório
```bash
# Criar .gitignore se não existir
echo "node_modules/
.env
*.db" > .gitignore

# Fazer push do código para GitHub
git add .
git commit -m "Pronto para deploy"
git push origin main
```

### 2. Criar Conta Render
- Ir para https://render.com
- Clicar "Sign up with GitHub"
- Autorizar acesso

### 3. Deploy
- Clicar "+ New" > "Web Service"
- Conectar repositório GitHub
- Configurar:
  - **Name**: `treinamentos-radial`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Instance Type**: Free (suficiente)

### 4. Deploy Automático
- Cada push para `main` fará deploy automático
- URL será gerada: `https://seu-app.onrender.com`

---

## ⚙️ Adaptações Necessárias

### Variáveis de Ambiente
Criar arquivo `.env`:
```env
NODE_ENV=production
PORT=3000
```

### Banco de Dados
- SQLite funciona no Render/Railway
- Para Oracle Cloud, considerar migrar para MySQL para melhor performance

---

## 🆘 Suporte e Documentação

- **Render**: https://render.com/docs
- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Oracle Cloud**: https://docs.oracle.com/cloud/free

---

**Última atualização**: Janeiro 2026
**Aplicação**: Sistema de Treinamentos Radial
