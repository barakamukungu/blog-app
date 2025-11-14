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

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.get('/', (req, res) => res.send('Blog API (in-memory + JSON files)'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

