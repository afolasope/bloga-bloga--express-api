const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogSchema = new Schema({
  id: ObjectId,
  title: {
    type: String,
    required: true,
    unique: [true, 'title should be unique'],
  },
  body: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  state: {
    type: String,
    enum: ['published', 'draft'],
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: Number,
  },
  tags: [{ type: String }],
  timestamp: {
    type: Schema.Types.Date,
    default: Date.now,
    immutable: true,
  },
});

const BlogModel = mongoose.model('blogs', BlogSchema);

module.exports = BlogModel;
