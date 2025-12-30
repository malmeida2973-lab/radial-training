const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const db = require('./database');
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

// ====== ROTAS API ======

// Criar novo treinamento
app.post('/api/treinamentos', async (req, res) => {
  const { titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, exigir_pin } = req.body;
  const codigoUnico = gerarCodigoUnico();
  const pinPresenca = exigir_pin ? Math.floor(100000 + Math.random() * 900000).toString() : null;

  db.run(
    `INSERT INTO treinamentos (titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, codigo_unico, pin_presenca, exigir_pin, nome_representante, telefone_representante, tecnicos) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, codigoUnico, pinPresenca, exigir_pin ? 1 : 0, nome_representante, telefone_representante, tecnicos],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar treinamento' });
      }
      
      const treinamentoId = this.lastID;
      const urlFormulario = `${req.protocol}://${req.get('host')}/formulario.html?t=${codigoUnico}`;
      
      // Gerar QR Code
      QRCode.toDataURL(urlFormulario, (err, qrcode) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao gerar QR Code' });
        }
        
        res.json({
          id: treinamentoId,
          codigo: codigoUnico,
          url: urlFormulario,
          qrcode: qrcode,
          pin_presenca: pinPresenca
        });
      });
    }
  );
});

// Listar todos os treinamentos
app.get('/api/treinamentos', (req, res) => {
  db.all(
    `SELECT t.*, COUNT(r.id) as total_respostas 
     FROM treinamentos t 
     LEFT JOIN respostas r ON t.id = r.treinamento_id 
     GROUP BY t.id 
     ORDER BY t.data DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar treinamentos' });
      }
      res.json(rows);
    }
  );
});

// Buscar treinamento por código
app.get('/api/treinamentos/:codigo', (req, res) => {
  db.get(
    'SELECT * FROM treinamentos WHERE codigo_unico = ? OR id = ?',
    [req.params.codigo, req.params.codigo],
    (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar treinamento' });
      }
      if (!row) {
        return res.status(404).json({ erro: 'Treinamento não encontrado' });
      }
      res.json(row);
    }
  );
});

// Atualizar treinamento existente
app.put('/api/treinamentos/:id', (req, res) => {
  const { titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, exigir_pin } = req.body;
  
  db.run(
    `UPDATE treinamentos 
     SET titulo = ?, empresa = ?, empresa_cliente = ?, data = ?, data_fim = ?, hora_inicio = ?, hora_fim = ?, local = ?, instrutor = ?, instrutores_adicionais = ?, nome_representante = ?, telefone_representante = ?, tecnicos = ?, exigir_pin = ?
     WHERE id = ?`,
    [titulo, empresa, empresa_cliente, data, data_fim, hora_inicio, hora_fim, local, instrutor, instrutores_adicionais, nome_representante, telefone_representante, tecnicos, exigir_pin ? 1 : 0, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao atualizar treinamento' });
      }
      res.json({ sucesso: true, alteracoes: this.changes });
    }
  );
});

// Gerar QR Code para treinamento existente
app.get('/api/treinamentos/:id/qrcode', async (req, res) => {
  db.get(
    'SELECT * FROM treinamentos WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ erro: 'Treinamento não encontrado' });
      }
      
      const urlFormulario = `${req.protocol}://${req.get('host')}/formulario.html?t=${row.codigo_unico}`;
      
      QRCode.toDataURL(urlFormulario, (err, qrcode) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao gerar QR Code' });
        }
        
        res.json({
          codigo: row.codigo_unico,
          url: urlFormulario,
          qrcode: qrcode,
          pin_presenca: row.pin_presenca,
          exigir_pin: row.exigir_pin
        });
      });
    }
  );
});

// Submeter resposta do formulário
app.post('/api/respostas', (req, res) => {
  const {
    treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
    avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes
  } = req.body;

  db.run(
    `INSERT INTO respostas 
     (treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
      avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [treinamento_id, nome, email, telefone, funcao, area, empresa_participante,
     avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: 'Erro ao salvar resposta' });
      }
      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

// ETAPA 1: Cadastro pré-treinamento
app.post('/api/cadastro', (req, res) => {
  const { treinamento_id, nome, email, telefone, funcao, area, empresa_participante } = req.body;

  // Verificar se já está cadastrado
  db.get(
    'SELECT * FROM respostas WHERE treinamento_id = ? AND email = ?',
    [treinamento_id, email],
    (err, row) => {
      if (row) {
        return res.json({ sucesso: true, id: row.id, ja_cadastrado: true });
      }

      db.run(
        `INSERT INTO respostas 
         (treinamento_id, nome, email, telefone, funcao, area, empresa_participante, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'cadastrado')`,
        [treinamento_id, nome, email, telefone, funcao, area, empresa_participante],
        function(err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao cadastrar participante' });
          }
          res.json({ sucesso: true, id: this.lastID, ja_cadastrado: false });
        }
      );
    }
  );
});

// ETAPA 2: Confirmar presença
app.post('/api/presenca', (req, res) => {
  const { treinamento_id, email, pin_fornecido } = req.body;

  // Buscar dados do treinamento
  db.get(
    'SELECT * FROM treinamentos WHERE id = ?',
    [treinamento_id],
    (err, treinamento) => {
      if (err || !treinamento) {
        return res.status(404).json({ erro: 'Treinamento não encontrado' });
      }

      // Verificar PIN se necessário
      if (treinamento.exigir_pin && pin_fornecido !== treinamento.pin_presenca) {
        return res.status(401).json({ erro: 'PIN de presença inválido', exigir_pin: true });
      }

      // Confirmar presença
      db.run(
        `UPDATE respostas 
         SET presente = 1, presenca_em = CURRENT_TIMESTAMP, status = 'presente'
         WHERE treinamento_id = ? AND email = ?`,
        [treinamento_id, email],
        function(err) {
          if (err) {
            return res.status(500).json({ erro: 'Erro ao confirmar presença' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ erro: 'Participante não encontrado' });
          }
          res.json({ sucesso: true });
        }
      );
    }
  );
});

// ETAPA 3: Submeter avaliação
app.post('/api/avaliacao', (req, res) => {
  const {
    treinamento_id, email,
    avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes
  } = req.body;

  db.run(
    `UPDATE respostas 
     SET avaliacao_geral = ?, avaliacao_conteudo = ?, avaliacao_instrutor = ?, 
         avaliacao_material = ?, sugestoes = ?, avaliado_em = CURRENT_TIMESTAMP, status = 'avaliado'
     WHERE treinamento_id = ? AND email = ?`,
    [avaliacao_geral, avaliacao_conteudo, avaliacao_instrutor, avaliacao_material, sugestoes, treinamento_id, email],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao salvar avaliação' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Participante não encontrado' });
      }
      res.json({ sucesso: true });
    }
  );
});

// Verificar status do participante
app.get('/api/participante/:treinamento_id/:email', (req, res) => {
  db.get(
    'SELECT * FROM respostas WHERE treinamento_id = ? AND email = ?',
    [req.params.treinamento_id, req.params.email],
    (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar participante' });
      }
      res.json(row || { status: 'nao_cadastrado' });
    }
  );
});

// Buscar participante por nome ou email (com LIKE para busca parcial)
app.get('/api/buscar-participante/:treinamento_id/:termo', (req, res) => {
  const termoBusca = `%${req.params.termo}%`;
  db.all(
    'SELECT nome, email, empresa_participante, status FROM respostas WHERE treinamento_id = ? AND (nome LIKE ? OR email LIKE ?)',
    [req.params.treinamento_id, termoBusca, termoBusca],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar participante' });
      }
      res.json(rows || []);
    }
  );
});

// Buscar respostas de um treinamento
app.get('/api/treinamentos/:id/respostas', (req, res) => {
  db.all(
    'SELECT * FROM respostas WHERE treinamento_id = ? ORDER BY cadastrado_em DESC',
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar respostas' });
      }
      res.json(rows);
    }
  );
});

// Upload de certificado (Admin): associa arquivo a uma resposta específica
app.post('/api/respostas/:id/certificado', upload.single('certificado'), (req, res) => {
  const respostaId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ erro: 'Arquivo de certificado não enviado' });
  }

  db.run(
    'UPDATE respostas SET certificado_arquivo = ? WHERE id = ?',
    [req.file.filename, respostaId],
    function (err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao salvar certificado' });
      }
      // Tentar enviar e-mail ao participante com o certificado anexado
      try {
        db.get(
          'SELECT r.email, r.nome, t.titulo, t.empresa FROM respostas r JOIN treinamentos t ON r.treinamento_id = t.id WHERE r.id = ?',
          [respostaId],
          async (e2, row) => {
            if (!e2 && row && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
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
            res.json({ sucesso: true, arquivo: req.file.filename });
          }
        );
      } catch (emailErr) {
        console.warn('Erro no fluxo de envio de e-mail:', emailErr.message);
        res.json({ sucesso: true, arquivo: req.file.filename });
      }
    }
  );
});

// Download de certificado por resposta (Admin)
app.get('/api/respostas/:id/certificado', (req, res) => {
  db.get('SELECT certificado_arquivo FROM respostas WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ erro: 'Certificado não encontrado' });
    if (!row.certificado_arquivo) return res.status(404).json({ erro: 'Certificado não enviado' });
    const filePath = path.join(uploadDir, row.certificado_arquivo);
    if (!fs.existsSync(filePath)) return res.status(404).json({ erro: 'Arquivo de certificado ausente' });
    res.download(filePath);
  });
});

// Download de certificado por treinamento+email (Participante)
app.get('/api/certificado/:treinamento_id/:email', (req, res) => {
  const { treinamento_id, email } = req.params;
  db.get(
    'SELECT nome, certificado_arquivo FROM respostas WHERE treinamento_id = ? AND email = ?',
    [treinamento_id, email],
    (err, row) => {
      if (err || !row) return res.status(404).json({ erro: 'Participante não encontrado' });
      if (!row.certificado_arquivo) return res.status(404).json({ erro: 'Certificado ainda não disponível' });
      const filePath = path.join(uploadDir, row.certificado_arquivo);
      if (!fs.existsSync(filePath)) return res.status(404).json({ erro: 'Arquivo de certificado ausente' });
      const safeName = (row.nome || 'certificado').replace(/[^a-zA-Z0-9_\- ]/g, '');
      res.download(filePath, `${safeName}_certificado.pdf`);
    }
  );
});

// Atualizar participante
app.put('/api/respostas/:id', (req, res) => {
  const { nome, email, telefone, funcao, area, empresa_participante } = req.body;
  db.run(
    `UPDATE respostas 
     SET nome = ?, email = ?, telefone = ?, funcao = ?, area = ?, empresa_participante = ?
     WHERE id = ?`,
    [nome, email, telefone, funcao, area, empresa_participante, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao atualizar participante' });
      }
      res.json({ sucesso: true, alteracoes: this.changes });
    }
  );
});

// Excluir participante
app.delete('/api/respostas/:id', (req, res) => {
  db.run(
    'DELETE FROM respostas WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao excluir participante' });
      }
      res.json({ sucesso: true, removidos: this.changes });
    }
  );
});

// Excluir treinamento (e respostas relacionadas)
app.delete('/api/treinamentos/:id', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM respostas WHERE treinamento_id = ?', [req.params.id]);
    db.run(
      'DELETE FROM treinamentos WHERE id = ?',
      [req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao excluir treinamento' });
        }
        res.json({ sucesso: true, removidos: this.changes });
      }
    );
  });
});

// Login admin
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  db.get('SELECT * FROM admin_users WHERE id = 1', (err, admin) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao verificar credenciais' });
    }
    
    if (!admin || admin.password !== password) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    
    res.json({ sucesso: true, username: admin.username });
  });
});

// Alterar senha admin
app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ erro: 'Nova senha deve ter no mínimo 6 caracteres' });
  }
  
  db.get('SELECT * FROM admin_users WHERE id = 1', (err, admin) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao verificar senha atual' });
    }
    
    if (!admin || admin.password !== currentPassword) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }
    
    db.run(
      'UPDATE admin_users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [newPassword],
      (err) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao atualizar senha' });
        }
        res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso!' });
      }
    );
  });
});

// Exportar dados em formato CSV
app.get('/api/exportar-csv', (req, res) => {
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
     WHERE r.treinamento_id = ?
     ORDER BY r.cadastrado_em DESC`;
  
  db.all(query, [treinamentoId], (err, rows) => {
    if (err) {
      console.error('Erro ao exportar CSV:', err);
      console.error('Query:', query);
      console.error('TreinamentoId:', treinamentoId);
      return res.status(500).json({ erro: 'Erro ao exportar dados: ' + err.message });
    }

    if (rows.length === 0) {
      return res.status(404).send('Nenhum participante cadastrado neste treinamento');
    }

    // Criar CSV com colunas organizadas
    const headers = Object.keys(rows[0]);
    const csvHeaders = headers.join(';'); // Usar ponto e vírgula para melhor compatibilidade com Excel
    
    const csvRows = rows.map(row => 
      headers.map(header => {
        const val = row[header] || '';
        // Escapar aspas duplas e adicionar aspas se contiver vírgula, ponto-e-vírgula ou quebra de linha
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(';')
    );
    
    const csv = [csvHeaders, ...csvRows].join('\r\n');
    
    // Nome do arquivo baseado no título do treinamento
    const nomeArquivo = titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dataExport = new Date().toISOString().split('T')[0];
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=radial_training_${nomeArquivo}_${dataExport}.csv`);
    res.send('\ufeff' + csv); // BOM para UTF-8 (Excel reconhece acentos)
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📝 Teste Formulário: http://localhost:${PORT}/formulario.html\n`);
});
