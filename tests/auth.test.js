const request = require('supertest');
const { connect } = require('./database');
const UserModel = require('../models/user.model');
const app = require('../app');

describe('Auth: Signup', () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it('should signup a user', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .set('content-type', 'application/json')
      .send({
        password: 'xoxoxo',
        firstName: 'ola',
        lastName: 'wale',
        email: 'wale@gmail.com',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', 'wale@gmail.com');
    expect(response.body.user).toHaveProperty('firstName', 'ola');
    expect(response.body.user).toHaveProperty('lastName', 'wale');
    expect(response.body.user).not.toHaveProperty('password', 'xoxoxo');
  });

  it('should login a user', async () => {
    // create user in out db
    const user = await UserModel.create({
      email: 'tobi',
      password: '123456',
      firstName: 'tobi',
      lastName:'tobi'
    });

    // login user
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'tobi',
        password: '123456',
        firstName: 'tobi',
        lastName:'tobi'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
