const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/Category');

router.get('/', categoryController.getAll);

module.exports = router;
