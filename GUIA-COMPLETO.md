# 🎓 Sistema de Formulários de Treinamento - Radial

## 📖 Guia Completo de Uso

### O que é este sistema?

Um sistema web completo para gerenciar formulários de avaliação de treinamentos, com acesso via QR Code. Perfeito para a Radial e empresas parceiras (NSK, FAG, SKF, etc.) coletarem feedback dos participantes de forma prática e organizada.

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js instalado (baixe em: https://nodejs.org/)
- Navegador web moderno
- Conexão com a internet (para primeira instalação)

### Passo 1: Instalar Dependências

Abra o PowerShell ou Terminal na pasta do projeto e execute:

```powershell
npm install
```

Aguarde a instalação das dependências (Express, SQLite, QRCode, etc.)

### Passo 2: Iniciar o Servidor

```powershell
npm start
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3000
📊 Painel Admin: http://localhost:3000/admin.html
📝 Teste Formulário: http://localhost:3000/formulario.html
```

---

## 📱 Como Usar - Passo a Passo

### Para Administradores:

#### 1️⃣ Criar um Novo Treinamento

1. Acesse: `http://localhost:3000/admin.html`
2. Preencha o formulário "Criar Novo Treinamento":
   - **Título**: Ex: "Treinamento Técnico de Rolamentos"
   - **Empresa**: Radial, NSK, FAG, SKF ou Outra
   - **Data**: Selecione a data do treinamento
   - **Local**: Ex: "São Paulo - SP"
   - **Instrutor**: Nome do instrutor
3. Clique em "🚀 Criar Treinamento e Gerar QR Code"

#### 2️⃣ Compartilhar o QR Code

Após criar o treinamento, você verá:
- ✅ Código único do treinamento
- 📱 QR Code para imprimir/projetar
- 🔗 Link direto do formulário
- 💾 Botão para baixar o QR Code em PNG

**Como compartilhar:**
- Imprima o QR Code e distribua aos participantes
- Projete na tela durante o treinamento
- Envie o link direto por WhatsApp/Email

#### 3️⃣ Acompanhar Respostas

1. Na tabela "📋 Treinamentos Cadastrados"
2. Veja quantas respostas cada treinamento recebeu
3. Clique em "👁️ Ver Respostas" para ver detalhes
4. Visualize dados de cada participante e avaliações

#### 4️⃣ Exportar Dados

1. Clique no botão "📊 Exportar Todos os Dados (CSV)"
2. Baixe o arquivo CSV com todos os dados
3. Abra no Excel/Google Sheets para análise

---

### Para Participantes:

#### 1️⃣ Acessar o Formulário

- **Via QR Code**: Abra a câmera do celular e aponte para o QR Code
- **Via Link**: Clique no link recebido por WhatsApp/Email

#### 2️⃣ Preencher os Dados

**Dados Pessoais** (obrigatórios):
- Nome completo
- E-mail
- Telefone/Celular
- Função/Cargo
- Área/Departamento
- Empresa

**Avaliação do Treinamento** (0-5 estrelas):
- ⭐ Avaliação Geral
- ⭐ Conteúdo Apresentado
- ⭐ Desempenho do Instrutor
- ⭐ Material Didático

**Sugestões** (opcional):
- Campo livre para comentários e sugestões

#### 3️⃣ Enviar

1. Clique em "Enviar Avaliação"
2. Aguarde a confirmação
3. ✅ Pronto! Sua avaliação foi registrada

---

## 💻 Estrutura do Projeto

```
Treinamento/
│
├── server.js              # Servidor backend (Node.js + Express)
├── database.js            # Configuração do banco de dados SQLite
├── package.json           # Dependências do projeto
├── treinamentos.db        # Banco de dados (criado automaticamente)
│
└── public/                # Arquivos frontend
    ├── index.html         # Página inicial
    ├── admin.html         # Painel administrativo
    └── formulario.html    # Formulário para participantes
```

---

## 🗄️ Banco de Dados

### Tabelas Criadas Automaticamente:

**1. treinamentos**
- Informações dos treinamentos cadastrados
- Título, empresa, data, local, instrutor
- Código único para cada treinamento

**2. respostas**
- Dados dos participantes
- Avaliações (1-5 estrelas)
- Sugestões e comentários
- Data/hora de resposta

---

## 🌐 Hospedagem Online (Opcional)

Para disponibilizar na internet:

### Opção 1: Render (Gratuito)
1. Crie conta em: https://render.com
2. Conecte seu repositório GitHub
3. Configure como "Web Service"
4. Deploy automático!

### Opção 2: Railway (Gratuito)
1. Crie conta em: https://railway.app
2. Faça deploy do projeto
3. Configure domínio personalizado

### Opção 3: Heroku
1. Crie conta em: https://heroku.com
2. Instale Heroku CLI
3. Execute: `heroku create` e `git push heroku main`

---

## 📊 Análise de Dados

### Exportação CSV

O arquivo exportado contém:
- Dados do treinamento (título, empresa, data, local, instrutor)
- Dados do participante (nome, email, telefone, função, área, empresa)
- Avaliações numéricas (0-5)
- Sugestões e comentários
- Data/hora de resposta

### Como Analisar:

1. Abra o CSV no Excel/Google Sheets
2. Crie gráficos de avaliação média
3. Filtre por empresa ou treinamento
4. Identifique pontos de melhoria

---

## 🔧 Solução de Problemas

### Erro ao iniciar servidor:
```
Porta 3000 já está em uso
```
**Solução**: Mude a porta no `server.js` ou feche outros programas.

### Banco de dados não cria:
```
Erro ao conectar ao banco de dados
```
**Solução**: Verifique permissões de escrita na pasta.

### QR Code não abre no celular:
**Solução**: 
- Verifique se o servidor está rodando
- Use o IP da máquina na rede local (ex: `http://192.168.1.100:3000`)
- Configure port forwarding no roteador

---

## 🎯 Casos de Uso

### Exemplo 1: Treinamento Radial
1. Criar treinamento "Manutenção Preventiva"
2. Empresa: Radial
3. Gerar QR Code e projetar na sala
4. 20 participantes preenchem no celular
5. Exportar dados e analisar feedback

### Exemplo 2: Treinamento NSK
1. Criar treinamento "Aplicação de Rolamentos NSK"
2. Empresa: NSK
3. Imprimir QR Code em folhetos
4. Participantes escaneiam ao final
5. Comparar avaliações com outros treinamentos

---

## 📞 Suporte e Personalização

### Customizações Possíveis:

- ✏️ Adicionar mais campos ao formulário
- 🎨 Alterar cores e logo (edite os arquivos HTML)
- 📧 Enviar email automático de confirmação
- 📱 Integrar com WhatsApp API
- ☁️ Sincronizar com Google Sheets

### Adicionar Logo da Empresa:

Edite o arquivo `public/formulario.html` e `public/admin.html`:
```html
<div class="logo">
    <img src="logo-radial.png" alt="Logo">
</div>
```

---

## 📝 Changelog

**Versão 1.0.0** (Dezembro 2024)
- ✅ Sistema completo de formulários
- ✅ Geração de QR Code
- ✅ Painel administrativo
- ✅ Exportação CSV
- ✅ Suporte multi-empresa
- ✅ Design responsivo para celular

---

## 📜 Licença

MIT License - Livre para uso e modificação

---

## 🙏 Agradecimentos

Desenvolvido para Radial - Auxiliando treinamentos de qualidade com tecnologia! 🚀

---

## ⚡ Comandos Úteis

```powershell
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Iniciar com auto-reload (desenvolvimento)
npm run dev

# Verificar versão Node.js
node --version

# Limpar banco de dados (cuidado!)
Remove-Item treinamentos.db
```

---

**Pronto para começar! 🎉**

Execute `npm install` e depois `npm start` para iniciar o sistema!
