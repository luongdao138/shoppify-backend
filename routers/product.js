const express = require('express');
const router = express.Router();

const productController = require('../controllers/Product');

router.get('/search', productController.searchProducts);
router.get('/', productController.getAll);
router.post('/', productController.create);
router.get('/:id', productController.getById);
router.delete('/:id', productController.deleteById);

module.exports = router;
