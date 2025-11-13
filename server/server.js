const express = require('express');
const cors = require('cors');
const path = require('path');
const blogRoutes = require('./routes/blog-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.get('/', (req, res) => res.send('Blog API (in-memory + JSON files)'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));