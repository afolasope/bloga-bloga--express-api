const request = require('supertest');
const { connect } = require('./database');
const app = require('../app');
// const moment = require('moment');
const BlogModel = require('../models/blog.model');
const UserModel = require('../models/user.model');
const { createRandomBlogs } = require('../factory/blogs.factory');
const { Types } = require('mongoose');

describe('Posts Route', () => {
  let conn;
  let token;
  let published;
  let drafts;
  let user;

  beforeAll(async () => {
    conn = await connect();

    user = await UserModel.create({
      email: 'wale@gmail.com',
      password: 'xoxoxo',
      firstName: 'afolasope',
      lastName: 'wale',
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'wale@gmail.com',
        password: 'xoxoxo',
      });

    token = loginResponse.body.token;

    published = createRandomBlogs(3, 'published', user._id);
    drafts = createRandomBlogs(2, 'draft', user._id);
  });

  afterEach(async () => {
    await BlogModel.deleteMany({});
  });

  afterAll(async () => {
    await conn.cleanup();
    await conn.disconnect();
  });

  it('should create post', async () => {
    const blogs = createRandomBlogs(1);

    const response = await request(app)
      .post('/posts')
      .send(blogs[0])
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('body');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('state');
  });

  it('should return all published posts for logged in and not logged in users', async () => {
    const allBlogs = await BlogModel.insertMany([...published, ...drafts]);

    const response = await request(app)
      .get('/posts')
      .set('content-type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(published.length);
    expect(response.body.every((obj) => obj.state === 'published')).toBe(true);
  });
  it('should return single published posts for logged in and not logged in users', async () => {
    const blog = await BlogModel.create(published[0]);
    const readcount = blog.read_count;

    const response = await request(app)
      .get(`/posts/${blog._id}`)
      .set('content-type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.read_count).toBe(readcount + 1);
  });
  it('should return all posts by a registered user', async () => {
    const userId = user._id;

    await BlogModel.insertMany([...published, ...drafts]);

    const response = await request(app)
      .get('/posts/my-posts')
      .set('Authorization', `Bearer ${token}`)
      .set('content-type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.every((obj) => obj.author === userId.toString())).toBe(
      true
    );
  });
  it('should return single post by registered user', async () => {
    const blogs = await BlogModel.insertMany([...published, ...drafts]);
    const blogId = blogs[0]._id;
    const response = await request(app)
      .get(`/posts/my-posts/${blogId.toString()}`)
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('should edit single post by registered user', async () => {
    const blog = await BlogModel.create(
      createRandomBlogs(1, 'draft', user._id)
    );
    const blogId = blog[0]._id;
    const response = await request(app)
      .patch(`/posts/my-posts/${blogId.toString()}`)
      .send({
        description: 'lorem',
        tags: ['tags', 'tag'],
        state: 'published',
        title: 'title',
        body: 'body',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.body.description).toBe('lorem');
    // expect(response.body.tags).toBe(['tags', 'tag']);
    expect(response.body.state).toBe('published');
    expect(response.body.title).toBe('title');
    expect(response.body.body).toBe('body');
  });
  it('should delete single post by registered user', async () => {
    const blog = await BlogModel.create(
      createRandomBlogs(1, 'draft', user._id)
    );
    const blogId = blog[0]._id;
    const response = await request(app)
      .delete(`/posts/my-posts/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('content-type', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('deletion successful');
  });
});
