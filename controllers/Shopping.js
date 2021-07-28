const ShoppingList = require('../models/ShoppingList');
const ShoppingDetail = require('../models/ShoppingDetail');
const Category = require('../models/Category');

module.exports = {
  create: async (req, res) => {
    const { name, user, items } = req.body;
    try {
      let newShoppingList = new ShoppingList({
        name,
        user,
      });
      newShoppingList = await newShoppingList.save();
      let newShoppingDetail = new ShoppingDetail({
        shopping_list: newShoppingList._id,
        items,
      });
      newShoppingDetail.save();
      return res.status(201).json(newShoppingList);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error');
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { status, items, name } = req.body;
    try {
      await ShoppingList.findByIdAndUpdate(id, {
        $set: { status, name },
      });
      await ShoppingDetail.findOneAndUpdate(
        { shopping_list: id },
        {
          $set: { items },
        }
      );

      return res.json('Update successfully!');
    } catch (error) {
      return res.status(500).json('Server error');
    }
  },
  getUserShoppingLists: async (req, res) => {
    const { user_id } = req.body;
    try {
      const list = await ShoppingList.find({ user: user_id }).sort({
        createdAt: -1,
      });

      return res.json(list);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error');
    }
  },
  getShoppingDetail: async (req, res) => {
    const { id } = req.params;
    try {
      const shopping_list = await ShoppingList.findById(id);
      const detail = await ShoppingDetail.findOne({
        shopping_list: id,
      }).populate({
        path: 'items.category',
        model: Category,
        select: '_id name',
      });

      return res.json({
        _id: detail._doc._id,
        items: detail._doc.items,
        createdAt: detail._doc.createdAt,
        list_info: {
          name: shopping_list.name,
          _id: shopping_list._id,
          createdAt: shopping_list.createdAt,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error');
    }
  },
  getDraftList: async (req, res) => {
    const { user_id } = req.query;
    try {
      const shopping_list = await ShoppingList.findOne({
        user: user_id,
        status: 0,
      });
      if (!shopping_list) return res.json(null);

      const detail = await ShoppingDetail.findOne({
        shopping_list: shopping_list._id,
      }).populate({
        path: 'items.category',
        model: Category,
        select: '_id name',
      });

      return res.json({
        _id: shopping_list._id,
        name: shopping_list.name,
        items: detail.items,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error');
    }
  },
  getShoppingListWithDetail: async (req, res) => {
    try {
      const { user_id } = req.params;
      const shopping_list = await ShoppingList.find(
        { user: user_id },
        '_id name createdAt status'
      );
      const data = await Promise.all(
        shopping_list.map(async (x) => {
          let resultObj = { ...x._doc };
          const detail = await ShoppingDetail.findOne({
            shopping_list: x._id,
          }).populate({
            path: 'items.category',
            model: Category,
            select: '_id name',
          });
          resultObj.items = detail.items;
          return resultObj;
        })
      );

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error');
    }
  },
};
