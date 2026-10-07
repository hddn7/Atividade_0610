const { readUsers, writeUsers } = require('../db');

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const index = users.findIndex((user) => Number(user.id) === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  users.splice(index, 1);
  writeUsers(users);

  return res.json({ message: 'Usuário removido com sucesso' });
};

module.exports = { deleteUser };
