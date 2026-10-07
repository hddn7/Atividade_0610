const { readUsers, writeUsers, normalizeUserInput, getNextId } = require('../db');

const createUser = (req, res) => {
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
};

module.exports = { createUser };
