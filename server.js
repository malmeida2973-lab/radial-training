const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const { dbRun, dbGet, dbAll } = require('./db-helpers');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Diretório de uploads de certificados
const uploadDir = path.join(__dirname, 'uploads', 'certificados');
fs.mkdirSync(uploadDir, { recursive: true });

// Configuração do multer para certificados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.pdf';
    const ts = Date.now();
    const id = req.params.id || 'cert';
    cb(null, `${id}_${ts}${ext}`);
  }
});
const upload = multer({ storage });

// Função auxiliar para gerar código único
function gerarCodigoUnico() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Normaliza datas (aceita dd/mm/aaaa ou aaaa-mm-dd) para ISO yyyy-mm-dd
function normalizarData(valor) {
  if (!valor || valor === '') return null;
  const valorStr = String(valor).trim();
  
  // Se já estiver no formato ISO, retorna como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(valorStr)) return valorStr;
  
  // Converte de dd/mm/aaaa para aaaa-mm-dd
  const match = /^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/.exec(valorStr);
  if (match) {
    const [, d, m, y] = match;
    const dd = d.padStart(2, '0');
    const mm = m.padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }
  
  // Se vier do input type="date" do HTML, pode vir como "YYYY-MM-DD" mas como timestamp
  // Extrai apenas a parte da data sem fazer conversão de timezone
  if (valorStr.includes('-')) {
    const justDate = valorStr.split('T')[0]; // Pega só YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(justDate)) return justDate;
  }
  
  return valorStr; // fallback: deixa como veio
}

// ====== ROTAS API ======

// Criar novo treinamento
app.post('/api/treinamentos', async (req, res) => {
  const { titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, exigir_pin } = req.body;
  const codigoUnico = gerarCodigoUnico();
  const pinPresenca = exigir_pin ? Math.floor(100000 + Math.random() * 900000).toString() : null;
  const dataISO = normalizarData(data);
  const dataFimISO = normalizarData(data_fim);
  try {
    const insertQuery = `
      INSERT INTO treinamentos (
        titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local,
        instrutor, instrutores_adicionais, codigo_unico, pin_presenca, exigir_pin,
        nome_representante, telefone_representante, tecnicos
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16
      ) RETURNING id`;

    const result = await dbRun(insertQuery, [
      titulo, empresa, empresa_cliente, dataISO, dataFimISO, hora_inicio, hora_fim, local,
      instrutor, instrutores_adicionais, codigoUnico, pinPresenca, Boolean(exigir_pin),
      nome_representante, telefone_representante, tecnicos
    ]);

    const treinamentoId = result.rows[0].id;
    const urlFormulario = `${req.protocol}://${req.get('host')}/formulario.html?t=${codigoUnico}`;
    const qrcode = await QRCode.toDataURL(urlFormulario);

    res.json({
      id: treinamentoId,
      codigo: codigoUnico,
      url: urlFormulario,
      qrcode,
      pin_presenca: pinPresenca
    });
  } catch (err) {
    console.error('Erro ao criar treinamento:', err);
    res.status(500).json({ erro: 'Erro ao criar treinamento' });
  }
});

// Listar todos os treinamentos
app.get('/api/treinamentos', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*, 
        COALESCE(r.total_respostas, 0) AS total_respostas
      FROM treinamentos t
      LEFT JOIN (
        SELECT treinamento_id, COUNT(*) AS total_respostas
        FROM respostas
        GROUP BY treinamento_id
      ) r ON t.id = r.treinamento_id
      ORDER BY t.data DESC`;

    const rows = await dbAll(query);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar treinamentos:', err);
    res.status(500).json({ erro: 'Erro ao buscar treinamentos' });
  }
});

// Buscar treinamento por código
app.get('/api/treinamentos/:codigo', async (req, res) => {
  try {
    const row = await dbGet(
      'SELECT * FROM treinamentos WHERE codigo_unico = $1 OR id::text = $1',
      [req.params.codigo]
    );

    if (!row) {
      return res.status(404).json({ erro: 'Treinamento não encontrado' });
    }
    res.json(row);
  } catch (err) {
    console.error('Erro ao buscar treinamento:', err);
    res.status(500).json({ erro: 'Erro ao buscar treinamento' });
  }
});

// Atualizar treinamento existente
app.put('/api/treinamentos/:id', async (req, res) => {
  const { titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, exigir_pin } = req.body;
  const dataISO = normalizarData(data);
  const dataFimISO = normalizarData(data_fim);
  try {
    const result = await dbRun(
      `UPDATE treinamentos 
       SET titulo = $1, empresa = $2, empresa_cliente = $3, data = $4, data_fim = $5, hora_inicio = $6, hora_fim = $7, local = $8, instrutor = $9, instrutores_adicionais = $10, nome_representante = $11, telefone_representante = $12, tecnicos = $13, exigir_pin = $14
       WHERE id = $15`,
      [titulo, empresa, empresa_cliente, dataISO, dataFimISO, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, Boolean(exigir_pin), req.params.id]
    );
    res.json({ sucesso: true, alteracoes: result.rowCount });
  } catch (err) {
    console.error('Erro ao atualizar treinamento:', err);
    res.status(500).json({ erro: 'Erro ao atualizar treinamento' });
  }
});

// Gerar QR Code para treinamento existente
app.get('/api/treinamentos/:id/qrcode', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM treinamentos WHERE id = $1', [req.params.id]);
    if (!row) {
      return res.status(404).json({ erro: 'Treinamento não encontrado' });
    }

    const urlFormulario = `${req.protocol}://${req.get('host')}/formulario.html?t=${row.codigo_unico}`;
    const qrcode = await QRCode.toDataURL(urlFormulario);

    res.json({
      codigo: row.codigo_unico,
      url: urlFormulario,
      qrcode,
      pin_presenca: row.pin_presenca,
      exigir_pin: row.exigir_pin
    });
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    res.status(500).json({ erro: 'Erro ao gerar QR Code' });
  }
});

// Submeter resposta do formulário
app.post('/api/respostas', async (req, res) => {
  const {
    treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
    avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes
  } = req.body;
  try {
    const result = await dbRun(
      `INSERT INTO respostas 
       (treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
        avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
       avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes]
    );
    res.json({ sucesso: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Erro ao salvar resposta:', err);
    res.status(500).json({ erro: 'Erro ao salvar resposta' });
  }
});

// ETAPA 1: Cadastro pré-treinamento
app.post('/api/cadastro', async (req, res) => {
  const { treinamento_id, nome, email, telefone, funcao, area, empresa_participante, consentimento_lgpd, consentimento_ip } = req.body;
  try {
    const existing = await dbGet(
      'SELECT * FROM respostas WHERE treinamento_id = $1 AND email = $2',
      [treinamento_id, email]
    );

    if (existing) {
      return res.json({ sucesso: true, id: existing.id, ja_cadastrado: true });
    }

    const result = await dbRun(
      `INSERT INTO respostas 
       (treinamento_id, nome, email, telefone, funcao, area, empresa_participante, status, consentimento_lgpd, consentimento_aceite_em, consentimento_ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'cadastrado', $8, CURRENT_TIMESTAMP, $9)
       RETURNING id`,
      [treinamento_id, nome, email, telefone, funcao, area, empresa_participante, Boolean(consentimento_lgpd), consentimento_ip]
    );

    res.json({ sucesso: true, id: result.rows[0].id, ja_cadastrado: false });
  } catch (err) {
    console.error('Erro ao cadastrar participante:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar participante' });
  }
});

// ETAPA 2: Confirmar presença
app.post('/api/presenca', async (req, res) => {
  const { treinamento_id, email, pin_fornecido } = req.body;
  try {
    const treinamento = await dbGet('SELECT * FROM treinamentos WHERE id = $1', [treinamento_id]);
    if (!treinamento) {
      return res.status(404).json({ erro: 'Treinamento não encontrado' });
    }

    if (treinamento.exigir_pin && pin_fornecido !== treinamento.pin_presenca) {
      return res.status(401).json({ erro: 'PIN de presença inválido', exigir_pin: true });
    }

    const result = await dbRun(
      `UPDATE respostas 
       SET presente = TRUE, presenca_em = CURRENT_TIMESTAMP, status = 'presente'
       WHERE treinamento_id = $1 AND email = $2`,
      [treinamento_id, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Participante não encontrado' });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao confirmar presença:', err);
    res.status(500).json({ erro: 'Erro ao confirmar presença' });
  }
});

// ETAPA 3: Submeter avaliação
app.post('/api/avaliacao', async (req, res) => {
  const {
    treinamento_id, email,
    avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes
  } = req.body;
  try {
    const result = await dbRun(
      `UPDATE respostas 
       SET avaliacao_geral = $1, avaliacao_conteudo = $2, avaliacao_instrutor = $3, 
           avaliacao_material = $4, sugestoes = $5, avaliado_em = CURRENT_TIMESTAMP, status = 'avaliado'
       WHERE treinamento_id = $6 AND email = $7`,
      [avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes, treinamento_id, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Participante não encontrado' });
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao salvar avaliação:', err);
    res.status(500).json({ erro: 'Erro ao salvar avaliação' });
  }
});

// Verificar status do participante
app.get('/api/participante/:treinamento_id/:email', async (req, res) => {
  try {
    const row = await dbGet(
      'SELECT * FROM respostas WHERE treinamento_id = $1 AND email = $2',
      [req.params.treinamento_id, req.params.email]
    );
    res.json(row || { status: 'nao_cadastrado' });
  } catch (err) {
    console.error('Erro ao buscar participante:', err);
    res.status(500).json({ erro: 'Erro ao buscar participante' });
  }
});

// Buscar participante por nome ou email (com LIKE para busca parcial)
app.get('/api/buscar-participante/:treinamento_id/:termo', async (req, res) => {
  const termoBusca = `%${req.params.termo}%`;
  try {
    const rows = await dbAll(
      'SELECT nome, email, empresa_participante, status FROM respostas WHERE treinamento_id = $1 AND (nome ILIKE $2 OR email ILIKE $3)',
      [req.params.treinamento_id, termoBusca, termoBusca]
    );
    res.json(rows || []);
  } catch (err) {
    console.error('Erro ao buscar participante:', err);
    res.status(500).json({ erro: 'Erro ao buscar participante' });
  }
});

// Buscar respostas de um treinamento
app.get('/api/treinamentos/:id/respostas', async (req, res) => {
  try {
    const rows = await dbAll(
      'SELECT * FROM respostas WHERE treinamento_id = $1 ORDER BY cadastrado_em DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar respostas:', err);
    res.status(500).json({ erro: 'Erro ao buscar respostas' });
  }
});

// Upload de certificado (Admin): associa arquivo a uma resposta específica
app.post('/api/respostas/:id/certificado', upload.single('certificado'), async (req, res) => {
  const respostaId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ erro: 'Arquivo de certificado não enviado' });
  }

  try {
    await dbRun('UPDATE respostas SET certificado_arquivo = $1 WHERE id = $2', [req.file.filename, respostaId]);

    try {
      const row = await dbGet(
        'SELECT r.email, r.nome, t.titulo, t.empresa FROM respostas r JOIN treinamentos t ON r.treinamento_id = t.id WHERE r.id = $1',
        [respostaId]
      );

      if (row && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Boolean(process.env.SMTP_SECURE === 'true'),
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        const filePath = path.join(uploadDir, req.file.filename);
        const subject = `Certificado - ${row.titulo}`;
        const from = process.env.SMTP_FROM || process.env.SMTP_USER;

        try {
          await transporter.sendMail({
            from,
            to: row.email,
            subject,
            text: `Olá ${row.nome},\n\nSeu certificado do treinamento "${row.titulo}" (${row.empresa}) está em anexo.\n\nObrigado pela participação!\n`,
            attachments: [
              { filename: `${(row.nome || 'certificado').replace(/[^a-zA-Z0-9_\- ]/g, '')}_certificado.pdf`, path: filePath }
            ]
          });
          console.log(`📧 Certificado enviado para ${row.email}`);
        } catch (mailErr) {
          console.warn('Falha ao enviar certificado por e-mail:', mailErr.message);
        }
      } else if (!process.env.SMTP_HOST) {
        console.log('SMTP não configurado; pulando envio de e-mail.');
      }
    } catch (emailErr) {
      console.warn('Erro no fluxo de envio de e-mail:', emailErr.message);
    }

    res.json({ sucesso: true, arquivo: req.file.filename });
  } catch (err) {
    console.error('Erro ao salvar certificado:', err);
    res.status(500).json({ erro: 'Erro ao salvar certificado' });
  }
});

// Download de certificado por resposta (Admin)
app.get('/api/respostas/:id/certificado', async (req, res) => {
  try {
    const row = await dbGet('SELECT certificado_arquivo FROM respostas WHERE id = $1', [req.params.id]);
    if (!row) return res.status(404).json({ erro: 'Certificado não encontrado' });
    if (!row.certificado_arquivo) return res.status(404).json({ erro: 'Certificado não enviado' });
    const filePath = path.join(uploadDir, row.certificado_arquivo);
    if (!fs.existsSync(filePath)) return res.status(404).json({ erro: 'Arquivo de certificado ausente' });
    res.download(filePath);
  } catch (err) {
    console.error('Erro ao baixar certificado:', err);
    res.status(500).json({ erro: 'Erro ao baixar certificado' });
  }
});

// Download de certificado por treinamento+email (Participante)
app.get('/api/certificado/:treinamento_id/:email', async (req, res) => {
  const { treinamento_id, email } = req.params;
  try {
    const row = await dbGet(
      'SELECT nome, certificado_arquivo FROM respostas WHERE treinamento_id = $1 AND email = $2',
      [treinamento_id, email]
    );
    if (!row) return res.status(404).json({ erro: 'Participante não encontrado' });
    if (!row.certificado_arquivo) return res.status(404).json({ erro: 'Certificado ainda não disponível' });
    const filePath = path.join(uploadDir, row.certificado_arquivo);
    if (!fs.existsSync(filePath)) return res.status(404).json({ erro: 'Arquivo de certificado ausente' });
    const safeName = (row.nome || 'certificado').replace(/[^a-zA-Z0-9_\- ]/g, '');
    res.download(filePath, `${safeName}_certificado.pdf`);
  } catch (err) {
    console.error('Erro ao baixar certificado:', err);
    res.status(500).json({ erro: 'Erro ao baixar certificado' });
  }
});

// Atualizar participante
app.put('/api/respostas/:id', async (req, res) => {
  const { nome, email, telefone, funcao, area, empresa_participante } = req.body;
  try {
    const result = await dbRun(
      `UPDATE respostas 
       SET nome = $1, email = $2, telefone = $3, funcao = $4, area = $5, empresa_participante = $6
       WHERE id = $7`,
      [nome, email, telefone, funcao, area, empresa_participante, req.params.id]
    );
    res.json({ sucesso: true, alteracoes: result.rowCount });
  } catch (err) {
    console.error('Erro ao atualizar participante:', err);
    res.status(500).json({ erro: 'Erro ao atualizar participante' });
  }
});

// Excluir participante
app.delete('/api/respostas/:id', async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM respostas WHERE id = $1', [req.params.id]);
    res.json({ sucesso: true, removidos: result.rowCount });
  } catch (err) {
    console.error('Erro ao excluir participante:', err);
    res.status(500).json({ erro: 'Erro ao excluir participante' });
  }
});

// Excluir treinamento (e respostas relacionadas)
app.delete('/api/treinamentos/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM respostas WHERE treinamento_id = $1', [req.params.id]);
    const result = await dbRun('DELETE FROM treinamentos WHERE id = $1', [req.params.id]);
    res.json({ sucesso: true, removidos: result.rowCount });
  } catch (err) {
    console.error('Erro ao excluir treinamento:', err);
    res.status(500).json({ erro: 'Erro ao excluir treinamento' });
  }
});

// Login admin
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;

  try {
    const admin = await dbGet('SELECT * FROM admin_users WHERE id = 1');
    if (!admin || admin.password !== password) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    res.json({ sucesso: true, username: admin.username });
  } catch (err) {
    console.error('Erro ao verificar credenciais:', err);
    res.status(500).json({ erro: 'Erro ao verificar credenciais' });
  }
});

// Alterar senha admin
app.post('/api/admin/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ erro: 'Nova senha deve ter no mínimo 6 caracteres' });
  }

  try {
    const admin = await dbGet('SELECT * FROM admin_users WHERE id = 1');
    if (!admin || admin.password !== currentPassword) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }

    await dbRun(
      'UPDATE admin_users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newPassword]
    );

    res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    res.status(500).json({ erro: 'Erro ao atualizar senha' });
  }
});

// Exportar dados em formato CSV
app.get('/api/exportar-csv', async (req, res) => {
  const treinamentoId = req.query.treinamentoId;
  const titulo = req.query.titulo || 'treinamento';
  
  if (!treinamentoId) {
    return res.status(400).json({ erro: 'ID do treinamento é obrigatório' });
  }
  
  const query = `SELECT 
      t.titulo as "Treinamento",
      t.empresa as "Empresa Organizadora",
      t.data as "Data",
      t.local as "Local",
      t.instrutor as "Instrutor Principal",
      r.nome as "Nome Participante",
      r.email as "Email",
      r.telefone as "Telefone",
      r.funcao as "Função",
      r.area as "Área",
      r.empresa_participante as "Empresa Participante",
      r.status as "Status",
      r.cadastrado_em as "Data Cadastro",
      r.presenca_em as "Data Presença",
      r.avaliado_em as "Data Avaliação",
      r.avaliacao_geral as "Avaliação Geral",
      r.avaliacao_instrutor as "Avaliação Instrutor",
      r.avaliacao_conteudo as "Avaliação Conteúdo",
      r.avaliacao_material as "Avaliação Materiais",
      r.sugestoes as "Sugestões",
      CASE WHEN r.certificado_arquivo IS NOT NULL THEN 'Sim' ELSE 'Não' END as "Certificado Enviado"
     FROM respostas r
     JOIN treinamentos t ON r.treinamento_id = t.id
     WHERE r.treinamento_id = $1
     ORDER BY r.cadastrado_em DESC`;
  
  try {
    const rows = await dbAll(query, [treinamentoId]);

    if (rows.length === 0) {
      return res.status(404).send('Nenhum participante cadastrado neste treinamento');
    }

    const headers = Object.keys(rows[0]);
    const csvHeaders = headers.join(';');
    
    const csvRows = rows.map(row => 
      headers.map(header => {
        const val = row[header] || '';
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(';')
    );
    
    const csv = [csvHeaders, ...csvRows].join('\r\n');
    
    const nomeArquivo = titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dataExport = new Date().toISOString().split('T')[0];
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=radial_training_${nomeArquivo}_${dataExport}.csv`);
    res.send('\ufeff' + csv);
  } catch (err) {
    console.error('Erro ao exportar CSV:', err);
    res.status(500).json({ erro: 'Erro ao exportar dados: ' + err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📝 Teste Formulário: http://localhost:${PORT}/formulario.html\n`);
});
