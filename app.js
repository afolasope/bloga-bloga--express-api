const express = require('express');

// routes
const postRouter = require('./routes/posts.router.js');
const authRouter = require('./routes/auth.router.js');
const { createRandomUsers } = require('./factory/user.factory');
const { createRandomBlogs } = require('./factory/blogs.factory.js');
const BlogModel = require('./models/blog.model.js');

require('./passport');

(async () => {
  await BlogModel.insertMany(
    createRandomBlogs(29, 'published', '636827bab47cb2593c8bf17b')
  );
})();
// (async () => {
//   await createRandomUsers(4)
// })();

const app = express();
app.use(express.json());

app.get('/', (req,res) => {
  res.status(200).send('Welcome to Bloga Bloga.');
});
app.use('/auth', authRouter);
app.use('/posts', postRouter);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
