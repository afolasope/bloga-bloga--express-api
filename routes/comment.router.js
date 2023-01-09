const express = require('express');
const passport = require('passport');

const { createComment } = require('../controllers/comment.controller');
const commentRouter = express.Router();

commentRouter.post(
  '/:id/comments',
  passport.authenticate('jwt', { session: false }),
  createComment
);

module.exports = { commentRouter };
