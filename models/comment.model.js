const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CommentSchema = new Schema({
  id: ObjectId,
  postID: {
    type: Schema.Types.ObjectId,
    ref: 'blogs',
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const CommentModel = mongoose.model('Comments', CommentSchema);

module.exports = { CommentModel };
