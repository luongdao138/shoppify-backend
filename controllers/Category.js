const Category = require('../models/Category');

module.exports = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find({}, '_id name');
      return res.json(categories);
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
};
