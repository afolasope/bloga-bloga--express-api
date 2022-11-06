const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { Types } = require('mongoose');
const BlogModel = require('../models/blog.model');
const UserModel = require('../models/user.model');

exports.createRandomBlogs = (length = 5, state = 'draft', authorId) => {
  const posts = Array.from({ length }).map(() => ({
    title: faker.lorem.sentence(8),
    description: faker.lorem.sentence(4),
    author: authorId ? new Types.ObjectId(authorId) : undefined,
    body: faker.lorem.paragraph(10),
    tags: [faker.lorem.word(4), faker.lorem.word(4), faker.lorem.word(6)],
    fullName: faker.name.fullName(),
    state,
    read_count: 34,
    reading_time: 7,
    tags: [faker.word.adjective(3), faker.word.adjective(5)],
    timestamp: faker.date.between(
      '2020-01-01T00:00:00.000Z',
      '2030-01-01T00:00:00.000Z'
    ),
  }));

  return posts;
};
