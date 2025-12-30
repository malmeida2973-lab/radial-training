# 🔄 Conversão para PostgreSQL - Guia Rápido

## ✅ Mudanças Feitas:

1. **✅ Adicionado `pg` ao package.json**
2. **✅ Criado database.js com PostgreSQL**
3. **✅ Server.js convertido totalmente para PostgreSQL (queries com `$1`, `RETURNING`, async/await)**

## 🚀 Próximos Passos:

### 1️⃣ No Railway Dashboard:

1. Clique em **"New"** (botão +)
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde 1 minuto para criar

### 2️⃣ Conectar ao Serviço:

1. Clique no banco **PostgreSQL** criado
2. Copie a variável **`DATABASE_URL`**
3. Vá no serviço **"treinamento radial"**
4. Vá em **"Variables"**
5. A variável já estará lá automaticamente! ✨

### 3️⃣ Fazer Push Final:

```bash
git add .
git commit -m "Adicionar suporte PostgreSQL"
git push
```

### 4️⃣ Aguardar Deploy:

Railway vai:
- Instalar dependências
- Conectar ao PostgreSQL
- Criar tabelas automaticamente via `database.js`
- Sistema funcionando! 🎉

---

## 💾 Dados Agora Persistem!

✅ PostgreSQL = Dados permanentes
✅ Backups automáticos
✅ Escalável
✅ Incluído no crédito grátis

---

## 🔙 Rollback (se necessário):

Se quiser voltar temporariamente ao SQLite local (apenas para desenvolvimento):

```bash
Move-Item server-sqlite.js.bak server.js -Force
Move-Item database-sqlite.js.bak database.js -Force
git add server.js database.js
git commit -m "Rollback para SQLite"
git push
```

Em produção, mantenha o PostgreSQL para persistência.

---

## 📊 Monitorar Custo:

No Railway Dashboard, veja:
- Uso de crédito em tempo real
- PostgreSQL + Web Service
- Sempre dentro dos $5 grátis!
