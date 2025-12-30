const { Pool } = require('pg');

// Configuração do PostgreSQL
// Railway fornece DATABASE_URL automaticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado ao PostgreSQL com sucesso!');
    release();
  }
});

// Criar tabelas
const initDB = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Tabela de administradores
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL DEFAULT 'admin',
        password VARCHAR(255) NOT NULL DEFAULT 'radial123',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inserir admin padrão se não existir
    await client.query(`
      INSERT INTO admin_users (id, username, password) 
      VALUES (1, 'admin', 'radial123')
      ON CONFLICT (id) DO NOTHING
    `);

    // Tabela de treinamentos
    await client.query(`
      CREATE TABLE IF NOT EXISTS treinamentos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        empresa VARCHAR(255) NOT NULL,
        empresa_cliente VARCHAR(255),
        data DATE NOT NULL,
        data_fim DATE,
        hora_inicio VARCHAR(10),
        hora_fim VARCHAR(10),
        local VARCHAR(255),
        instrutor VARCHAR(255),
        instrutores_adicionais TEXT,
        codigo_unico VARCHAR(50) UNIQUE NOT NULL,
        pin_presenca VARCHAR(50),
        exigir_pin BOOLEAN DEFAULT FALSE,
        nome_representante VARCHAR(255),
        telefone_representante VARCHAR(20),
        tecnicos TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de participantes e respostas
    await client.query(`
      CREATE TABLE IF NOT EXISTS respostas (
        id SERIAL PRIMARY KEY,
        treinamento_id INTEGER NOT NULL,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        funcao VARCHAR(255),
        area VARCHAR(255),
        empresa_participante VARCHAR(255),
        status VARCHAR(50) DEFAULT 'cadastrado',
        presente BOOLEAN DEFAULT FALSE,
        avaliacao_geral INTEGER,
        avaliacao_conteudo INTEGER,
        avaliacao_instrutor INTEGER,
        avaliacao_material INTEGER,
        sugestoes TEXT,
        cadastrado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        presenca_em TIMESTAMP,
        avaliado_em TIMESTAMP,
        certificado_arquivo VARCHAR(255),
        consentimento_lgpd BOOLEAN DEFAULT FALSE,
        consentimento_aceite_em TIMESTAMP,
        consentimento_ip VARCHAR(45),
        FOREIGN KEY (treinamento_id) REFERENCES treinamentos(id)
      )
    `);

    // Adicionar colunas LGPD se não existirem (para migração)
    try {
      await client.query(`ALTER TABLE respostas ADD COLUMN consentimento_lgpd BOOLEAN DEFAULT FALSE`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }

    try {
      await client.query(`ALTER TABLE respostas ADD COLUMN consentimento_aceite_em TIMESTAMP`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }

    try {
      await client.query(`ALTER TABLE respostas ADD COLUMN consentimento_ip VARCHAR(45)`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        throw e;
      }
    }

    await client.query('COMMIT');
    console.log('✅ Tabelas criadas/verificadas com sucesso no PostgreSQL');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Inicializar banco de dados
initDB().catch(console.error);

module.exports = pool;
