const passport = require('passport');
const express = require('express');

const {
  getPosts,
  getOwnPosts,
  getSinglePostByID,
  createPost,
  editPost,
  deletePost,
  getOwnPostById,
} = require('../controllers/post.controller');
const { verifyPostOwner } = require('../middleware/verifyPostOwner');

const postRouter = express.Router();

// logged in user should create post
postRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createPost
);

// owner of post should be able to update post
postRouter.patch(
  '/my-posts/:id',
  passport.authenticate('jwt', { session: false }),
  verifyPostOwner,
  editPost
);

// owner of post should be able to delete post
postRouter.delete(
  '/my-posts/:id',
  passport.authenticate('jwt', { session: false }),
  verifyPostOwner,
  deletePost
);

//gets a list of posts authored by user
postRouter.get(
  '/my-posts',
  passport.authenticate('jwt', { session: false }),
  getOwnPosts
);
// gets a single published post by user
postRouter.get(
  '/my-posts/:id',
  passport.authenticate('jwt', { session: false }),
  verifyPostOwner,
  getOwnPostById
);

// logged and not logged in users should get posts
postRouter.get('/', getPosts); //gets all  PUBLISHED posts
postRouter.get('/:id', getSinglePostByID); //gets A published post

module.exports = postRouter;
