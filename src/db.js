const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'users.json');

const ensureStore = () => {
  fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, '[]', 'utf8');
  }
};

const readUsers = () => {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};

const writeUsers = (users) => {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2), 'utf8');
};

const normalizeUserInput = (body) => {
  const nome = String(body.nome ?? '').trim();
  const sobrenome = String(body.sobrenome ?? '').trim();
  const email = String(body.email ?? '').trim();
  const telefone = String(body.telefone ?? '').trim();
  const rua = String(body.rua ?? '').trim();
  const bairro = String(body.bairro ?? '').trim();
  const cidade = String(body.cidade ?? '').trim();
  const estado = String(body.estado ?? '').trim();
  const rg = String(body.rg ?? '').trim();
  const idade = Number(body.idade);

  if (
    !nome ||
    !sobrenome ||
    !email ||
    !telefone ||
    !rua ||
    !bairro ||
    !cidade ||
    !estado ||
    !rg ||
    Number.isNaN(idade)
  ) {
    throw new Error('Preencha todos os campos do cadastro corretamente.');
  }

  return {
    nome,
    sobrenome,
    email,
    idade,
    telefone,
    rua,
    bairro,
    cidade,
    estado,
    rg
  };
};

const getNextId = (users) => {
  if (!users.length) return 1;
  return Math.max(...users.map((user) => Number(user.id))) + 1;
};

module.exports = {
  ensureStore,
  readUsers,
  writeUsers,
  normalizeUserInput,
  getNextId
};
