require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/user.routes');


app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');


app.use('/uploads', express.static('src/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;