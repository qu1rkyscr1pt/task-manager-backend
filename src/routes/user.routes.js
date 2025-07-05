const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getAllUsers, createUser, updateUser, deleteUser
} = require('../controllers/user.controller');
const { assignTask } = require('../controllers/user.controller');
const userController = require('../controllers/user.controller');

router.use(auth);

// Only admins allowed
router.get('/', (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, getAllUsers);

router.post('/', (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, createUser);

router.put('/:id', (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, updateUser);

router.delete('/:id', (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, deleteUser);

router.put('/:userId/assign-task', userController.assignTask);

module.exports = router;
