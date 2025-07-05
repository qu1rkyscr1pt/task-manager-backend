const request = require('supertest');
const app = require('../src/app'); 
const testEmail = `user_${Date.now()}@example.com`;

describe('Auth Tests', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: '12345678',
        role: 'user'
      });

        console.log('RESPONSE:', res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
       expect(res.body.user.email).toBe(testEmail);
  });
});
