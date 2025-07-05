const { Task, User, Document } = require('../models');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// CREATE Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.userId;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: userId
    });

    // Save uploaded PDFs
    if (req.files && req.files.length > 0) {
      const docs = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        taskId: task.id
      }));
      await Document.bulkCreate(docs);
    }

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error('CREATE TASK ERROR:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// GET all tasks (admin sees all, users see their own)
exports.getTasks = async (req, res) => {
  try {
    
    const { status, priority, sort = 'dueDate', order = 'asc', page = 1, limit = 5 } = req.query;

    const whereClause = req.user.role === 'admin'
      ? {}
      : { assignedTo: req.user.userId };

    // Apply filters
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;

    const offset = (page - 1) * limit;

    const tasks = await Task.findAndCountAll({
      where: whereClause,
      order: [[sort, order]],
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
  { model: Document, as: 'documents', attributes: ['id', 'filename', 'originalName', 'size'] }
]
    });

    res.json({
      total: tasks.count,
      page: parseInt(page),
      pages: Math.ceil(tasks.count / limit),
      tasks: tasks.rows
    });
  } catch (err) {
    console.error('Error fetching filtered tasks:', err);
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [{ model: User, as: 'user', attributes: ['id', 'email'] }]
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (user.role !== 'admin' && task.assignedTo !== user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ task });
  } catch (err) {
    console.error('GET task/:id error', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// PUT /tasks/:id
exports.updateTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Document, as: 'documents' }]
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Handle both JSON and multipart/form-data
    const updates = {
      title: req.body.title || task.title,
      description: req.body.description || task.description,
      status: req.body.status || task.status,
      priority: req.body.priority || task.priority,
      dueDate: req.body.dueDate || task.dueDate,
      assignedTo: req.body.assignedTo !== undefined ? req.body.assignedTo : task.assignedTo,
    };

    await task.update(updates);

    if (req.files && req.files.length > 0) {
      // Delete existing files from storage
      for (const doc of task.documents) {
        const filePath = path.join(__dirname, '../uploads', doc.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await doc.destroy();
      }

      // Save new files to DB
      for (const file of req.files) {
        await Document.create({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          taskId: task.id,
        });
      }
    }

    const updatedTask = await Task.findByPk(taskId, {
      include: [{ model: Document, as: 'documents' }]
    });

    res.json({ message: 'Task updated', task: updatedTask });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};


// DELETE Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'admin' && task.assignedTo !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
