const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const SECRET = 'dev_secret_change_me';
const usersFile = path.join(__dirname, '..', 'data', 'users.json');

const read = (file) => {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file,'utf8')||'[]'); } catch { return []; }
};

exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.authorizeBlogOwner = (req, res, next) => {
  const blogsFile = path.join(__dirname,'..','data','blogs.json');
  const blogs = read(blogsFile);
  const blog = blogs.find(b=>b._id===req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  if (!blog.user || blog.user._id !== req.userId) return res.status(403).json({ message: 'Not owner' });
  next();
};