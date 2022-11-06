const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const AuthController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res, next) =>
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
      return AuthController.signup(req, res);
    }

    return res.send(400, info);
  })(req, res, next)
);

authRouter.post('/login', async (req, res, next) =>
  passport.authenticate('login', (err, user, info) => {
    AuthController.login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = authRouter;
