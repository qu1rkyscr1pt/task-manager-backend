const { User, Task } = require('../models');
const bcrypt = require('bcrypt');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Create a user
exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    await User.update({ email, role }, { where: { id: req.params.id } });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed' });
  }
};

exports.assignTask = async (req, res) => {
  const { userId } = req.params;
  const { taskId } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.assignedTo = userId;
    await task.save();

    res.json({ message: 'Task assigned successfully' });
  } catch (err) {
    console.error('Assign task error:', err);
    res.status(500).json({ message: 'Failed to assign task' });
  }
};
