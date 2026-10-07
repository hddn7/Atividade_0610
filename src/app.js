const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
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
  const idade = Number(body.idade);

  if (!nome || !sobrenome || !email || Number.isNaN(idade)) {
    throw new Error('Preencha nome, sobrenome, email e idade válidos.');
  }

  return {
    nome,
    sobrenome,
    email,
    idade
  };
};

const getNextId = (users) => {
  if (!users.length) return 1;
  return Math.max(...users.map((user) => Number(user.id))) + 1;
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const user = users.find((item) => Number(item.id) === id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json(user);
});

app.post('/api/users', (req, res) => {
  try {
    const users = readUsers();
    const userData = normalizeUserInput(req.body);
    const newUser = {
      id: getNextId(users),
      ...userData
    };

    users.push(newUser);
    writeUsers(users);

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const users = readUsers();
    const index = users.findIndex((user) => Number(user.id) === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const userData = normalizeUserInput(req.body);
    const updatedUser = {
      ...users[index],
      ...userData
    };

    users[index] = updatedUser;
    writeUsers(users);

    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const index = users.findIndex((user) => Number(user.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  users.splice(index, 1);
  writeUsers(users);

  return res.json({ message: 'Usuário removido com sucesso' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
