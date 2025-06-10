const express = require('express');
const { add, index, view, deleteData, deleteMany, update } = require('./meeting');
const authMiddleware = require('../../middelwares/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Meeting routes
router.post('/', add);
router.get('/', index);
router.get('/:id', view);
router.delete('/:id', deleteData);
router.post('/delete-many', deleteMany);
router.put('/:id', update);

module.exports = router