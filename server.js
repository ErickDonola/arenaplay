// ============================================================
// server.js — Backend Arena Play Quadras
// ------------------------------------------------------------
// Cadastro e login de usuários: REAIS (PostgreSQL local).
// Demais recursos (esportes, horários, equipamentos, campeonatos,
// vídeos, agendamentos): MOCKADOS a partir do db.json.
//
// Rodar:  npm run server
// ============================================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ------------------------------------------------------------
// Configuração do banco PostgreSQL
// (ajuste via variáveis de ambiente se necessário)
// ------------------------------------------------------------
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'dono',
  database: process.env.PGDATABASE || 'playquadra',
});

// ------------------------------------------------------------
// Dados mockados (lidos do db.json em memória)
// ------------------------------------------------------------
const dbPath = path.join(__dirname, 'db.json');
let mockData = {};
try {
  mockData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
} catch (err) {
  console.error('[MOCK] Não foi possível ler db.json:', err.message);
}

// ------------------------------------------------------------
// Garante a tabela de usuários no Postgres
// ------------------------------------------------------------
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id           SERIAL PRIMARY KEY,
      nome         VARCHAR(120) NOT NULL,
      email        VARCHAR(160) NOT NULL UNIQUE,
      senha        VARCHAR(120) NOT NULL,
      avatar       TEXT,
      data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('[DB] Tabela "usuarios" pronta.');
}

// Converte a linha do banco para o formato esperado pelo app
function serializeUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    nome: row.nome,
    email: row.email,
    avatar: row.avatar,
    dataCriacao: row.data_criacao,
  };
}

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// ROTAS REAIS — Usuários (PostgreSQL)
// ============================================================

// Listar usuários
app.get('/usuarios', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, email, avatar, data_criacao FROM usuarios ORDER BY id'
    );
    res.json(rows.map(serializeUser));
  } catch (err) {
    console.error('[GET /usuarios]', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Buscar usuário por id
app.get('/usuarios/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, email, avatar, data_criacao FROM usuarios WHERE id = $1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(serializeUser(rows[0]));
  } catch (err) {
    console.error('[GET /usuarios/:id]', err.message);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

// Cadastro de novo usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, avatar = null } = req.body || {};

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();

  try {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, avatar)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, avatar, data_criacao`,
      [String(nome).trim(), emailNormalizado, String(senha), avatar]
    );
    res.status(201).json(serializeUser(rows[0]));
  } catch (err) {
    // 23505 = violação de UNIQUE (e-mail já cadastrado)
    if (err.code === '23505') {
      return res
        .status(409)
        .json({ error: 'Este e-mail já está cadastrado.' });
    }
    console.error('[POST /usuarios]', err.message);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const emailNormalizado = String(email).trim().toLowerCase();

  try {
    const { rows } = await pool.query(
      'SELECT id, nome, email, senha, avatar, data_criacao FROM usuarios WHERE email = $1',
      [emailNormalizado]
    );

    if (rows.length === 0 || rows[0].senha !== String(senha)) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    res.json(serializeUser(rows[0]));
  } catch (err) {
    console.error('[POST /login]', err.message);
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
});

// ============================================================
// ROTAS MOCKADAS — lidas do db.json (somente leitura)
// ============================================================
const recursosMock = [
  'esportes',
  'horariosDisponiveis',
  'equipamentos',
  'campeonatos',
  'videoSessoes',
  'agendamentos',
];

recursosMock.forEach((recurso) => {
  // Lista completa
  app.get(`/${recurso}`, (req, res) => {
    res.json(mockData[recurso] || []);
  });

  // Item por id
  app.get(`/${recurso}/:id`, (req, res) => {
    const lista = mockData[recurso] || [];
    const item = lista.find((i) => String(i.id) === String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: 'Recurso não encontrado.' });
    }
    res.json(item);
  });

  // Escrita mockada — apenas devolve eco, não persiste
  app.post(`/${recurso}`, (req, res) => {
    res.status(201).json({ id: String(Date.now()), ...req.body });
  });
  app.put(`/${recurso}/:id`, (req, res) => {
    res.json({ id: req.params.id, ...req.body });
  });
  app.delete(`/${recurso}/:id`, (req, res) => {
    res.json({});
  });
});

// ------------------------------------------------------------
// Inicialização
// ------------------------------------------------------------
const PORT = Number(process.env.PORT) || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🏐 Arena Play API rodando em http://localhost:${PORT}`);
      console.log('   • Usuários (cadastro/login): PostgreSQL');
      console.log('   • Demais recursos: mock (db.json)\n');
    });
  })
  .catch((err) => {
    console.error('[FATAL] Falha ao conectar no PostgreSQL:', err.message);
    console.error('Verifique se o banco "playquadra" existe e as credenciais.');
    process.exit(1);
  });
