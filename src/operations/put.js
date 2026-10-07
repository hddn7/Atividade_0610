const { readUsers, writeUsers, normalizeUserInput } = require('../db');

const updateUser = (req, res) => {
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
};

module.exports = { updateUser };
