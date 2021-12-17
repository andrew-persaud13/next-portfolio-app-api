const slugify = require('slugify');
const uniqueSlug = require('unique-slug');
const Blog = require('../db/models/blog');

const { getAccessToken, getAuth0User } = require('./auth');

exports.getAllBlogs = async (req, res) => {
  try {
    // const cachedUsers = {};
    const blogs = await Blog.find({ status: 'published' }).sort({
      createdAt: -1,
    });

    let result = await blogs.reduce(
      async (acc, blog) => {
        if (acc.then) acc = await acc;

        const newBlog = { ...blog._doc };
        const { access_token } = await getAccessToken();

        if (acc.cache[blog.userId]) {
          newBlog.user = acc.cache[blog.userId];
        } else {
          newBlog.user = await getAuth0User(access_token, blog.userId);
          acc.cache[blog.userId] = newBlog.user;
        }

        acc.blogs.push(newBlog);
        return acc;
      },
      { blogs: [], cache: {} }
    );

    res.json(result.blogs);
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    res.json(blog);
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.getBlogBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const blog = await Blog.findOne({ slug });
    const { access_token } = await getAccessToken();
    const user = await getAuth0User(access_token, blog.userId);
  

    return res.json({ blog, author: user });
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
};

exports.createBlog = async (req, res) => {
  const { body } = req;
  body.userId = req.user.sub;
  const blog = new Blog(body);

  try {
    const createdBlog = await blog.save();
    res.json(createdBlog);
  } catch (err) {
    res.status(422).send(err);
  }
};

const _saveBlog = async blog => {
  try {
    const createdBlog = await blog.save(); //might have dupe slug, need to handle it
    return createdBlog;
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      blog.slug += `-${uniqueSlug()}`;
    }
    return _saveBlog(blog);
  }
};

exports.updateBlog = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  try {
    const blog = await Blog.findById(id);

    if (req.body.status && req.body.status === 'published' && !blog.slug) {
      blog.slug = slugify(blog.title, { lower: true, replacement: '-' });
    }
    blog.set(body);
    blog.updatedAt = new Date();
    const updatedBlog = await _saveBlog(blog);
    res.json(updatedBlog);
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.getUserBlogs = async (req, res) => {
  const userId = req.user.sub;
  try {
    const blogs = await Blog.find({ userId, status: { $ne: 'deleted' } });
    res.json(blogs);
  } catch (err) {
    res.status(422).send(err);
  }
};

exports.deleteBlogs = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findOneAndRemove({ _id: id });
    res.json(deletedBlog);
  } catch (err) {
    res.status(422).send(err);
  }
};
