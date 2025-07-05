const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth.middleware');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { files: 3 }
});

router.use(auth);

// All tasks for logged-in user (or admin)
router.get('/', getTasks);

// Get single task by ID
router.get('/:id', getTaskById);

// Create task
router.post('/', upload.array('documents', 3), createTask);

// Update task
router.put('/:id', upload.array('documents', 3), updateTask);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router;
