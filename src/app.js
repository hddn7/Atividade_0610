const express = require('express');
const path = require('path');

const { listUsers, getUserById } = require('./operations/get');
const { createUser } = require('./operations/post');
const { updateUser } = require('./operations/put');
const { deleteUser } = require('./operations/delete');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/users', listUsers);
app.get('/api/users/:id', getUserById);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
