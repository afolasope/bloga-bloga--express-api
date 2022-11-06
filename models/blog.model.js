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
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  fullName: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['published', 'draft'],
  },
  read_count: {
    type: Number,
    default: 0,
    required:true
  },
  reading_time: {
    type: Number,
    required: true,
  },
  tags: [{ type: String }],
  timestamp: {
    type: Schema.Types.Date,
    default: Date.now,
    immutable: true,
    required: true,
  },
});

const BlogModel = mongoose.model('blogs', BlogSchema);

module.exports = BlogModel;
