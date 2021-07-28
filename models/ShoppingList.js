const { Schema, model } = require('mongoose');

const ShoppingListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const ShoopingList = model('ShoppingList', ShoppingListSchema);
module.exports = ShoopingList;
