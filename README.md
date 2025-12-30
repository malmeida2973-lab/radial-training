# 🎓 Radial Training - Sistema de Gestão de Treinamentos

> Sistema web completo para gerenciar treinamentos com acesso via QR Code, avaliações e certificados.

[![Deploy no Railway](https://img.shields.io/badge/Deploy-Railway-6B47DC)](https://railway.app)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Características

- 🎯 **QR Code** - Acesso rápido via smartphone
- 📱 **Responsivo** - Funciona em qualquer dispositivo
- 👥 **Multi-participantes** - Controle de cadastro e presença
- ⭐ **Avaliações** - Sistema de rating e feedback
- 📜 **Certificados** - Upload e download de certificados PDF
- 📊 **Exportação CSV** - Dados formatados para Excel
- 🎨 **Branding Radial** - Cores e identidade visual da marca
- 💬 **WhatsApp** - Botões para contato com instrutores
- 🔐 **Painel Admin** - Gerenciamento completo

## 🚀 Deploy Rápido

### Opção 1: Railway (Recomendado)
```bash
# Execute o script de preparação
.\init-git.ps1

# Siga as instruções no terminal
# Veja detalhes em: DEPLOY-RAILWAY.md
```

### Opção 2: Desenvolvimento Local (PostgreSQL)
```bash
# Instalar dependências
npm install

# Definir variável DATABASE_URL (ex.: postgres://user:pass@localhost:5432/radial_training)
# Em Windows PowerShell
$env:DATABASE_URL="postgres://user:pass@localhost:5432/radial_training"

# Iniciar servidor
npm run dev

# Acessar em: http://localhost:3000
```

## 📋 Estrutura do Projeto

```
radial-training/
├── public/              # Frontend
│   ├── admin.html      # Painel administrativo
│   ├── formulario.html # Formulário do participante
│   ├── login.html      # Tela de login
│   └── index.html      # Página inicial
├── uploads/            # Certificados enviados
│   └── certificados/
├── server.js           # Servidor Express
├── database.js         # Configuração PostgreSQL (pool + criação de tabelas)
├── package.json        # Dependências
├── railway.json        # Config deploy Railway
└── DEPLOY-RAILWAY.md   # Guia completo de deploy
```

## 💻 Tecnologias

- **Backend:** Node.js + Express
- **Banco:** PostgreSQL (pg/Pool)
- **Frontend:** HTML5 + CSS3 + JavaScript
- **QR Code:** qrcode.js
- **Upload:** Multer
- **Deploy:** Render.com

## 📖 Como Usar

### 1. Painel Admin
```
http://localhost:3000/admin.html
```
- Criar treinamentos
- Gerar QR Codes
- Ver participantes
- Exportar dados CSV

### 2. Participantes
- Escanear QR Code ou acessar link
- Cadastrar dados
- Confirmar presença
- Avaliar treinamento
- Baixar certificado

## 🔒 Segurança e LGPD

✅ HTTPS automático (em produção)  
✅ Dados criptografados em trânsito  
✅ Backup automático disponível  
✅ Logs de auditoria  

**Importante:** Sistema coleta dados pessoais. Consulte guia de conformidade LGPD.

**Banco e Persistência:**
- Em produção, use `DATABASE_URL` fornecida pelo Railway (PostgreSQL gerenciado).
- Tabelas são criadas automaticamente no primeiro start (`database.js`).
- Backups/retention via painel do provedor (Railway). 

## 📊 Exportação de Dados

Cada treinamento pode ser exportado individualmente:
- Formato: CSV (UTF-8 com BOM)
- Compatível: Excel, Google Sheets
- Colunas: 21 campos organizados
- Filtro: Por treinamento específico

## 🆘 Suporte

- 📖 [Guia de Deploy](DEPLOY-RENDER.md)
- 🐛 Issues: GitHub Issues
- 📧 Email: Suporte Radial

## 📄 Licença

MIT License - Radial Rolamentos

---

**Desenvolvido com ❤️ para Radial Rolamentos**  
*Desde 1968 - Maior estoque da América Latina*
