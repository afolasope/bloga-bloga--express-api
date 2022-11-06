const express = require('express');


// routes
const postRouter = require('./routes/posts.router.js');
const authRouter = require('./routes/auth.router.js');
// const { createRandomUsers } = require('./factory/user.factory');
// const { createRandomBlogs } = require('./factory/blogs.factory.js');

require('./passport');

// (async () => {
//   await createRandomBlogs(2);
// })()
// (async () => {
//   await createRandomUsers(10);
// })();

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/posts', postRouter);

app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({ error: err.message });
});



module.exports= app