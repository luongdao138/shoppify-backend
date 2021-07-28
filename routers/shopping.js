const express = require('express');
const router = express.Router();

const shoppingController = require('../controllers/Shopping');

router.post('/', shoppingController.create);
router.patch('/:id', shoppingController.update);
router.post('/history', shoppingController.getUserShoppingLists);
router.get('/detail/:id', shoppingController.getShoppingDetail);
router.get('/getDraft', shoppingController.getDraftList);
router.get('/getAll/:user_id', shoppingController.getShoppingListWithDetail);

module.exports = router;
