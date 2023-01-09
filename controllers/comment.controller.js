const { CommentModel } = require('../models/comment.model');

exports.createComment = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  console.log(user);

  const { userID, text } = req.body;

  const comment = await CommentModel.create({
    postID: id,
    text,
    userID: user.email,
    createdAt: Date.now(),
  });

  return res.status(200).json(comment);
};

// exports.createComment = async (req, res) => {
//   const { id } = req.params;
//   const { user, text } = req.body;

//   const comment = await CommentModel.findOneAndUpdate();
// };
