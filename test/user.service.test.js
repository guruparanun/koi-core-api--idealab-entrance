const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

describe('User Service', () => {
  it('should create a new user', async () => {
    const response = await request.post('/users').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(response.status).toBe(201);
  });

  // Add more tests for other CRUD operations
});
