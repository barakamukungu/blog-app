const fs = require('fs');
const path = require('path');

const blogsFile = path.join(__dirname, '..', 'data', 'blogs.json');
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

const read = (file) => {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || '[]'); } catch { return []; }
};
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

exports.getAllBlogs = (req, res) => {
  const blogs = read(blogsFile);
  res.status(200).json({ blogs });
};

exports.addBlog = (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  const users = read(usersFile);
  const blogs = read(blogsFile);
  const user = users.find(u => u._id === userId) || null;

  const image = req.file
    ? `/uploads/${req.file.filename}`
    : (req.body.imageUrl?.startsWith('http')
        ? req.body.imageUrl
        : null);

  const newBlog = {
    _id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    image,
    user: user ? { _id: user._id, name: user.name } : null,
    createdAt: new Date().toISOString()
  };

  blogs.push(newBlog);
  write(blogsFile, blogs);
  res.status(201).json({ message: 'Blog added', blog: newBlog });
};

exports.getBlogById = (req, res) => {
  const blogs = read(blogsFile);
  const blog = blogs.find(b => b._id === req.params.id);
  if (!blog) return res.status(404).json({ message: 'Not found' });
  res.status(200).json({ blog });
};

exports.updateBlog = (req, res) => {
  const blogs = read(blogsFile);
  const blog = blogs.find(b => b._id === req.params.id);
  if (!blog) return res.status(404).json({ message: 'Not found' });

  const { title, description } = req.body;
  blog.title = title ?? blog.title;
  blog.description = description ?? blog.description;

  if (req.file) {
    blog.image = `/uploads/${req.file.filename}`;
  }

  write(blogsFile, blogs);
  res.status(200).json({ message: 'Updated', blog });
};

exports.deleteBlog = (req, res) => {
  let blogs = read(blogsFile);
  const idx = blogs.findIndex(b => b._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const [deleted] = blogs.splice(idx, 1);
  write(blogsFile, blogs);
  res.status(200).json({ message: 'Deleted', blog: deleted });
};

exports.getByUserId = (req, res) => {
  const blogs = read(blogsFile);
  const userBlogs = blogs.filter(b => b.user?._id === req.params.id);
  res.status(200).json({ blogs: userBlogs });
};