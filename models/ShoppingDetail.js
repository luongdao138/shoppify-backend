const { Schema, model } = require('mongoose');

const ShoppingDetailSchema = new Schema(
  {
    shopping_list: {
      type: Schema.Types.ObjectId,
      ref: 'ShoppingList',
    },
    items: [
      {
        _id: {
          type: Schema.Types.ObjectId,
        },
        name: { type: String, required: true },
        number: { type: Number, required: true },
        category: {
          type: Schema.Types.ObjectId,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ShoppingDetail = model('ShoppingDetail', ShoppingDetailSchema);
module.exports = ShoppingDetail;
