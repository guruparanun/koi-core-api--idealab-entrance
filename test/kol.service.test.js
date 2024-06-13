const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

describe('KOL Service', () => {
  let jwtToken;
  
  beforeAll(async () => {
    // Add user registration and authentication logic
  });

  it('should create a new KOL', async () => {
    const response = await request.post('/kol')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'Ninejoe Ninejoe',
        platform: 'Facebook',
        sex: 'Male',
        categories: ['Lifestyle'],
        tel: '0998935365',
        link: 'https://www.facebook.com/tsomton?mibextid=LQQJ4d',
        followers: 7900,
        photoCost: 800,
        videoCost: 1000,
        er: '2.12',
      });
    expect(response.status).toBe(201);
  });

  // Add more tests for other CRUD operations
});
