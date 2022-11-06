const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

require('dotenv').config();

exports.signup = async (req, res) => {
  const { email, firstName, lastName, _id } = req.user;
  console.log('working');

  return res.status(201).json({
    user: {
      _id,
      email,
      firstName,
      lastName,
    },
  });
};

exports.login = (req, res, { err, user, info }) => {
  if (!user) {
    return res.json({ message: 'Email or password is incorrect' });
  }

  // req.login is provided by passport
  req.login(user, { session: false }, async (error) => {
    if (error) return res.status(400).json(error);

    const body = { _id: user._id, email: user.email };

    const token = jwt.sign(
      { user: body },
      process.env.JWT_SECRET || 'something_secret',
      { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 }
    );

    return res.status(200).json({ token });
  });
};
