const express = require('express');

// routes
const postRouter = require('./routes/posts.router.js');
const authRouter = require('./routes/auth.router.js');
const { createRandomUsers } = require('./factory/user.factory');
const { createRandomBlogs } = require('./factory/blogs.factory.js');
const BlogModel = require('./models/blog.model.js');
const { commentRouter } = require('./routes/comment.router.js');

require('./passport');

/* (async () => {
  await BlogModel.insertMany(
    createRandomBlogs(39, 'published', '6368307a578fbee59a071a77')
  );
})();*/
// (async () => {
//   await createRandomUsers(10)
// })();

const app = express();
app.use(express.json());

app.get('/', (req,res) => {
  res.status(200).send('Welcome to Bloga Bloga.');
});
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/posts', commentRouter)

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});
module.exports = app;
