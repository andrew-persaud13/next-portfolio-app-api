const express = require('express');
const {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getUserBlogs,
  deleteBlogs,
} = require('../controllers/blogs');
const { checkJwt, checkRole } = require('../controllers/auth');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/me', checkJwt, checkRole('admin'), getUserBlogs);
router.get('/:id', getBlogById);
router.get('/s/:slug', getBlogBySlug);

router.post('/', checkJwt, checkRole('admin'), createBlog);

router.patch('/:id', checkJwt, checkRole('admin'), updateBlog);

router.delete('/:id', checkJwt, checkRole('admin'), deleteBlogs);

module.exports = router;
