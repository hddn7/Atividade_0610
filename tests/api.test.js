const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('GET /api/users deve retornar lista de usuários', async () => {
  const response = await request(app).get('/api/users');

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('POST /api/users deve criar um usuário', async () => {
  const payload = {
    nome: 'Maria',
    sobrenome: 'Silva',
    email: 'maria@email.com',
    idade: 28
  };

  const response = await request(app)
    .post('/api/users')
    .send(payload);

  assert.equal(response.status, 201);
  assert.equal(response.body.nome, 'Maria');
  assert.equal(response.body.email, 'maria@email.com');
});

test('PUT /api/users/:id deve atualizar um usuário', async () => {
  const created = await request(app)
    .post('/api/users')
    .send({
      nome: 'João',
      sobrenome: 'Souza',
      email: 'joao@email.com',
      idade: 30
    });

  const response = await request(app)
    .put(`/api/users/${created.body.id}`)
    .send({
      nome: 'João',
      sobrenome: 'Costa',
      email: 'joao@email.com',
      idade: 31
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.sobrenome, 'Costa');
  assert.equal(response.body.idade, 31);
});

test('DELETE /api/users/:id deve remover um usuário', async () => {
  const created = await request(app)
    .post('/api/users')
    .send({
      nome: 'Ana',
      sobrenome: 'Pereira',
      email: 'ana@email.com',
      idade: 25
    });

  const response = await request(app).delete(`/api/users/${created.body.id}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.message, 'Usuário removido com sucesso');
});
