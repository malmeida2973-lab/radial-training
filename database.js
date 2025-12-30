const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Definir caminho do banco de dados
// Em produção (Render), usa disco persistente
// Em desenvolvimento, usa pasta local
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/data/treinamentos.db' 
  : './treinamentos.db';

// Criar diretório se não existir (produção)
if (process.env.NODE_ENV === 'production') {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

// Criar/conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log(`Conectado ao banco de dados SQLite: ${dbPath}`);
  }
});

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de treinamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS treinamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      empresa TEXT NOT NULL,
      empresa_cliente TEXT,
      data DATE NOT NULL,
      data_fim DATE,
      hora_inicio TEXT,
      hora_fim TEXT,
      local TEXT,
      instrutor TEXT,
      instrutores_adicionais TEXT,
      codigo_unico TEXT UNIQUE NOT NULL,
      pin_presenca TEXT,
      exigir_pin BOOLEAN DEFAULT 0,
      nome_representante TEXT,
      telefone_representante TEXT,
      tecnicos TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de participantes e respostas
  db.run(`
    CREATE TABLE IF NOT EXISTS respostas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      treinamento_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT,
      funcao TEXT,
      area TEXT,
      empresa_participante TEXT,
      status TEXT DEFAULT 'cadastrado',
      presente BOOLEAN DEFAULT 0,
      avaliacao_geral INTEGER,
      avaliacao_conteudo INTEGER,
      avaliacao_instrutor INTEGER,
      avaliacao_material INTEGER,
      sugestoes TEXT,
      cadastrado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      presenca_em DATETIME,
      avaliado_em DATETIME,
      certificado_arquivo TEXT,
      FOREIGN KEY (treinamento_id) REFERENCES treinamentos(id)
    )
  `);

  // Garantir coluna de certificado (para bases existentes)
  db.all("PRAGMA table_info(respostas)", (err, rows) => {
    if (!err) {
      const hasCert = rows.some(r => r.name === 'certificado_arquivo');
      if (!hasCert) {
        db.run("ALTER TABLE respostas ADD COLUMN certificado_arquivo TEXT", (e2) => {
          if (e2) {
            console.warn('Aviso ao adicionar coluna certificado_arquivo:', e2.message);
          }
        });
      }
    }
  });

  // Garantir colunas de contato (para bases existentes)
  db.all("PRAGMA table_info(treinamentos)", (err, rows) => {
    if (!err) {
      const colunas = rows.map(r => r.name);
      const colunasNovas = [
        'instrutores_adicionais',
        'tecnicos',
        'nome_representante',
        'telefone_representante'
      ];
      
      colunasNovas.forEach(coluna => {
        if (!colunas.includes(coluna)) {
          db.run(`ALTER TABLE treinamentos ADD COLUMN ${coluna} TEXT`, (e2) => {
            if (e2) {
              console.warn(`Aviso ao adicionar coluna ${coluna}:`, e2.message);
            }
          });
        }
      });
      
      // Remover colunas antigas se existirem (para evitar conflitos)
      const colunasAntigas = ['telefone_instrutor', 'telefone_tecnico', 'nome_tecnico'];
      colunasAntigas.forEach(coluna => {
        if (colunas.includes(coluna)) {
          console.log(`Coluna ${coluna} ainda existe (será mantida para compatibilidade)`);
        }
      });
    }
  });

  console.log('Tabelas criadas/verificadas com sucesso');
});

module.exports = db;
