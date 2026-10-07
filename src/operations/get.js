const { readUsers } = require('../db');

const listUsers = (req, res) => {
  const users = readUsers();
  return res.json(users);
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const user = users.find((item) => Number(item.id) === id);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json(user);
};

module.exports = { listUsers, getUserById };
