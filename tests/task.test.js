const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');
const jwt = require('jsonwebtoken');


let token;
let taskId;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // Create a user and login to get token
  const user = await db.User.create({
    email: 'taskuser@example.com',
    password: await require('bcrypt').hash('password123', 10),
    role: 'user'
  });

  token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Task API Tests', () => {
  test('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Sample Task')
      .field('description', 'A test task')
      .field('status', 'pending')
      .field('priority', 'low')
      .field('dueDate', new Date().toISOString().split('T')[0]);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Task created');
    taskId = res.body.task.id;
  });

  test('should fetch tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  test('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Task', status: 'in-progress' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task updated');
  });

  test('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});
