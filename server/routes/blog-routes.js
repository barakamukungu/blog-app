const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getByUserId,
} = require('../controllers/blog-controller');
const { authenticate, authorizeBlogOwner } = require('../middleware/auth');

// multer storage to server/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const upload = multer({ storage });

router.get('/', getAllBlogs);
router.post('/add', authenticate, upload.single('image'), addBlog);
router.get('/user/:id', getByUserId);
router.get('/:id', getBlogById);
router.put('/update/:id', authenticate, authorizeBlogOwner, upload.single('image'), updateBlog);
router.delete('/:id', authenticate, authorizeBlogOwner, deleteBlog);

module.exports = router;