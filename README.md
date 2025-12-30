# 🎓 Radial Training - Sistema de Gestão de Treinamentos

> Sistema web completo para gerenciar treinamentos com acesso via QR Code, avaliações e certificados.

[![Deploy no Render](https://img.shields.io/badge/Deploy-Render-46E3B7)](https://render.com)
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

### Opção 1: Render.com (Recomendado)
```bash
# Execute o script de preparação
.\init-git.ps1

# Siga as instruções no terminal
# Veja detalhes em: DEPLOY-RENDER.md
```

### Opção 2: Desenvolvimento Local
```bash
# Instalar dependências
npm install

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
├── database.js         # Configuração SQLite
├── package.json        # Dependências
├── render.yaml         # Config deploy Render
└── DEPLOY-RENDER.md    # Guia completo de deploy
```

## 💻 Tecnologias

- **Backend:** Node.js + Express
- **Banco:** SQLite3
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
