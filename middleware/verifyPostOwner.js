const { Types } = require('mongoose');
const BlogModel = require('../models/blog.model');

exports.verifyPostOwner = async function (req, res, next) {
  const { id } = req.params;
  const { user } = req;
  if (!user) {
    return res.json({
      message: 'please log in to perform this action',
    });
  }
  const post = await BlogModel.findOne({
    _id: new Types.ObjectId(id),
    author: new Types.ObjectId(user._id),
  });

  if (!post) {
    return res.json({
      message: 'you have no post with the ID provided',
    });
  }

  next();
};
