# 💾 Guia: Ativar Persistência de Disco no Render

## ✅ Status Atual

Seu projeto **já está configurado** para persistência! 

- ✅ `render.yaml` com disco montado
- ✅ `database.js` detecta ambiente automáticamente
- ✅ Banco de dados salvo em `/opt/render/project/src/data/treinamentos.db`

## 🎯 O que fazer após Deploy

### Opção 1: Dashboard Render (Recomendado)

1. **Acesse o Render Dashboard:**
   - https://dashboard.render.com/

2. **Selecione seu serviço:**
   - `radial-training`

3. **Vá para "Disks" (Discos):**
   - Você verá: `radial-training-data`
   - Tamanho: 1GB
   - Mount Path: `/opt/render/project/src/data`

4. **Status deve estar:**
   - ✅ Connected
   - ✅ 1 GB allocated

### Opção 2: Verificar via Logs

1. **Vá em "Logs"** no Render Dashboard
2. **Procure por:**
   ```
   Conectado ao banco de dados SQLite: /opt/render/project/src/data/treinamentos.db
   ```
3. Se aparecer ✅ significa que está usando o disco persistente

## 🔧 Configuração Técnica

### Arquivo: `render.yaml`
```yaml
disk:
  name: radial-training-data
  mountPath: /opt/render/project/src/data
  sizeGB: 1
```

- **name:** Nome do disco (identificador único)
- **mountPath:** Caminho onde o disco é montado
- **sizeGB:** Tamanho alocado (máx 100GB no free tier)

### Arquivo: `database.js`
```javascript
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/data/treinamentos.db' 
  : './treinamentos.db';
```

- Em **produção:** Usa `/opt/render/project/src/data/` (disco persistente)
- Em **desenvolvimento:** Usa `./treinamentos.db` (pasta local)

## 📊 Pasta de Uploads (Certificados)

Para manter certificados também persistentes, adicionar ao `render.yaml`:

```yaml
    envVars:
      - key: UPLOADS_PATH
        value: /opt/render/project/src/data/uploads
```

E no `server.js`:
```javascript
const uploadsPath = process.env.UPLOADS_PATH || './uploads';
```

## ⚠️ Importante: Dorme após Inatividade

No plano **Free** do Render:
- ❌ Serviço dorme após **15 minutos** de inatividade
- ✅ Banco de dados **NÃO é deletado** (persiste!)
- ✅ Dados voltam quando alguém acessa

### Manter Ativo (Opcional)

Use serviço de ping automático:
1. **UptimeRobot:** https://uptimerobot.com/
2. **Criar monitoramento:**
   - URL: `https://radial-training.onrender.com`
   - Intervalo: 14 minutos
   - Ping a cada 10 minutos

## 🔄 Aumentar Tamanho do Disco

Se precisar de mais espaço:

1. **Editar `render.yaml`:**
```yaml
disk:
  sizeGB: 5  # Aumentar para 5GB
```

2. **Fazer commit:**
```bash
git add render.yaml
git commit -m "Aumentar disco para 5GB"
git push
```

3. **Render redeploy automaticamente**

## 🛟 Backup Manual

Adicionar dados de backup via Render:

1. **Dashboard > Service > Files**
2. **Baixar arquivos do disco:**
   - Banco de dados
   - Certificados
   - Uploads

## ✅ Checklist

- [ ] Service Deploy concluído
- [ ] Logs mostram path correto
- [ ] Disco "radial-training-data" conectado
- [ ] Dados persistem após reinício
- [ ] UptimeRobot configurado (opcional)

---

**Seu sistema está totalmente preparado para produção!** 🚀
