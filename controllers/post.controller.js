const { json } = require('body-parser');
const { Types, isValidObjectId } = require('mongoose');

const BlogModel = require('../models/blog.model');
const UserModel = require('../models/user.model');

exports.createPost = async (req, res) => {
  const reqBody = req.body;
  const { title, description, tags, body, state } = reqBody;
  console.log('working');
  if (!title || !body) {
    return res.json({
      message: 'unable to create blog as there is a missing credential',
    });
  }

  const { user } = req;
  // estimating reading time
  const wpm = 225; //words per minute
  const words = body.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);

  const findUser = await UserModel.findById(user._id);

  const blog = await BlogModel.create({
    title,
    description,
    // : `${findUser.firstName} ${findUser.lastName}`,
    reading_time: time,
    author: findUser._id,
    tags,
    body,
    state: state || 'draft',
  });

  return res.status(200).send(blog);
};

exports.getPosts = async (req, res) => {
  const { author, title, tags, page = 1, limit = 20 } = req.query;
  let { sort_by } = req.query;

  const searchBy = {
    state: 'published',
  };

  if (title) {
    searchBy.title = { $regex: title };
  }

  if (author) {
    searchBy.author = { $regex: author, $options: 'i' };
  }

  if (tags) {
    const tagsArr = tags.split(',');
    if (tagsArr.length === 1) {
      searchBy.tags = tags;
    } else {
      searchBy.tags = {
        $all: tagsArr,
      };
    }
  }

  // sort
  sort_by = sort_by || '-timestamp';
  const orderQuery = {};
  const sortAttributes = sort_by.split(',');

  for (const attribute of sortAttributes) {
    if (attribute.startsWith('-')) {
      orderQuery[attribute.substr(1, attribute.length - 1)] = -1;
    } else {
      orderQuery[attribute] = 1;
    }
  }
  // end of sort

  const posts = await BlogModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDoc',
      },
    },
    {
      $unwind: '$authorDoc',
    },
    {
      $match: searchBy,
    },
    {
      $project: {
        title: 1,
        state: 1,
        description: 1,
        body: 1,
        author: {
          $concat: ['$authorDoc.lastName', ' ', '$authorDoc.firstName'],
        },
        read_count: 1,
        reading_time: 1,
        tags: 1,
        timestamp: 1,
      },
    },
    {
      $sort: orderQuery,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit * 1,
    },
  ]);
  console.log((page - 1) * limit);

  return res.json(posts);
};

exports.getSinglePostByID = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.json({
      message: 'No posts match ID provided',
    });
  }

  const posts = await BlogModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDoc',
      },
    },
    {
      $unwind: '$authorDoc',
    },
    {
      $match: {
        _id: new Types.ObjectId(id),
        state: 'published',
      },
    },
    {
      $project: {
        title: 1,
        state: 1,
        description: 1,
        body: 1,
        read_count: 1,
        reading_time: 1,
        tags: 1,
        timestamp: 1,
        author_doc: {
          name: {
            $concat: ['$authorDoc.lastName', ' ', '$authorDoc.firstName'],
          },
          email: '$authorDoc.email',
        },
      },
    },
  ]);
  if (!posts || posts.length < 1) {
    return res.json({
      message: 'No posts match the ID provided',
    });
  }

  const post = posts[0];
  const readCount = post.read_count + 1;

  await BlogModel.updateOne(
    { _id: new Types.ObjectId(id) },
    { read_count: readCount }
  );

  post.read_count = readCount;
  return res.status(200).json(post);
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.json({
      message: 'No posts match ID provided',
    });
  }

  const post = await BlogModel.findByIdAndDelete(id);

  if (!post) {
    return res.status(404).json({
      message: 'no post match the Id provided',
    });
  }

  return res.json({
    message: 'deletion successful',
  });
};

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const value = req.body;
  const { body, description, tags, state, title } = value;
  const post = await BlogModel.findByIdAndUpdate(id);

  if (!post) {
    return res.status(404).json({
      status: false,
      post: null,
      message: 'no post match the Id',
    });
  }

  body ? (post.body = body) : null;
  tags ? (post.tags = tags) : null;
  description ? (post.description = description) : null;
  state ? (post.state = state) : null;
  title ? (post.title = title) : null;

  await post.save();

  return res.json(post);
};

exports.getOwnPosts = async (req, res) => {
  const { page = 1, limit = 20, state = 'draft' } = req.query;
  const { _id } = req.user;
  const filterBy = {
    author: new Types.ObjectId(_id),
  };
  if (state) {
    filterBy.state = state;
  }
  const ownPosts = await BlogModel.find(filterBy)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  if (!ownPosts) {
    return res.json(ownPosts);
  }


  // const post = ownPosts[0];
  // const readCount = post.read_count + 1;

  // await BlogModel.updateOne(
  //   { _id: new Types.ObjectId(id) },
  //   { read_count: readCount }
  // );

  // post.read_count = readCount;
  // return res.status(200).json(post);

  return res.json(ownPosts);
};

exports.getOwnPostById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.json({
      message: 'No posts match ID provided',
      post: null,
    });
  }

  const post = await BlogModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDoc',
      },
    },
    {
      $unwind: '$authorDoc',
    },
    {
      $match: { _id: Types.ObjectId(id) },
    },
    {
      $project: {
        title: 1,
        state: 1,
        description: 1,
        body: 1,
        read_count: 1,
        reading_time: 1,
        tags: 1,
        timestamp: 1,
        author_doc: {
          name: {
            $concat: ['$authorDoc.lastName', ' ', '$authorDoc.firstName'],
          },
          email: '$authorDoc.email',
        },
      },
    },
  ]);

  if (!post) {
    return res.json({
      message: 'no post match ID provided',
    });
  }

  await BlogModel.updateOne({ _id: id }, { $inc: { read_count: 1 } });

  return res.json(post);
};
