const express = require('express');
const { createComment } = require('../controllers/comment.controller');
const commentRouter = express.Router();

commentRouter.post('/:id/comments', createComment);

module.exports = { commentRouter };
