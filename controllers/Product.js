const Category = require('../models/Category');
const Product = require('../models/Product');

module.exports = {
  create: async (req, res) => {
    const { name, category, image, note, username } = req.body;

    try {
      let existCategory = await Category.findOne({ name: category });

      if (!existCategory) {
        existCategory = new Category({ name: category });
        existCategory = await existCategory.save();
      }

      let newPro = new Product({
        name,
        category: existCategory._id,
        image,
        note,
        createdBy: username,
        updatedBy: username,
      });
      newPro = await newPro.save();
      return res.status(201).json({
        product: {
          ...newPro._doc,
          category: {
            _id: existCategory._id,
            name: existCategory.name,
          },
        },
      });
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  getAll: async (req, res) => {
    try {
      const products = await Product.find(
        { isDeleted: false },
        'category _id name'
      ).populate({
        path: 'category',
        model: Category,
        select: '_id name',
      });

      return res.json(products);
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        _id: id,
        isDeleted: false,
      }).populate({
        path: 'category',
        model: Category,
        select: '_id name',
      });

      if (!product) return res.status(400).json('Product does not exist!');

      return res.json(product);
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  deleteById: async (req, res) => {
    const { id } = req.params;
    try {
      await Product.findByIdAndUpdate(id, {
        $set: {
          isDeleted: true,
        },
      });

      return res.json('Delete successfully!');
    } catch (error) {
      return res.status(500).json('Server error!');
    }
  },
  searchProducts: async (req, res) => {
    const { searchTerm } = req.query;
    console.log(searchTerm);
    try {
      const products = await Product.find(
        {
          isDeleted: false,
          name: {
            $regex: new RegExp(searchTerm, 'i'),
          },
        },
        'category _id name'
      ).populate({
        path: 'category',
        model: Category,
        select: '_id name',
      });

      return res.json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json('Server error!');
    }
  },
};
