const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// import { faker } from '@faker-js/faker/locale/de';

const UserModel = require('../models/user.model');

exports.createRandomUsers = async (length = 10) => {
  const password = 'xoxoxo';
  const hash = await bcrypt.hash(password, 10);
  const users = Array.from({ length }).map(() => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: hash,
  }));

  // console.log(users);

  await UserModel.insertMany(users);
};
