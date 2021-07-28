const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    note: String,
    image: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    updatedBy: String,
    createdBy: String,
  },
  {
    timestamps: true,
  }
);

const Product = model('Product', ProductSchema);
module.exports = Product;
