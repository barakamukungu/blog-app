const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFile = path.join(__dirname, '..', 'data', 'users.json');
const SECRET = 'dev_secret_change_me';

const read = (file) => {
  if (!fs.existsSync(file)) return [];
  try {
    const txt = fs.readFileSync(file, 'utf8');
    return JSON.parse(txt || '[]');
  } catch {
    return [];
  }
};
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const users = read(usersFile);
  if (users.find(u=>u.email===email)) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = { _id: Math.random().toString(36).substr(2,9), name, email, password: hashed };
  users.push(user);
  write(usersFile, users);
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' });
  res.status(201).json({ message: 'Signup successful', user: {_id: user._id, name: user.name, email: user.email}, token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const users = read(usersFile);
  const user = users.find(u=>u.email===email);
  if (!user) return res.status(404).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(404).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '7d' });
  res.status(200).json({ message: 'Login successful', user: {_id: user._id, name: user.name, email: user.email}, token });
};