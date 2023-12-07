const mongoose = require('mongoose');
const orderItemSchema = mongoose.Schema(
  {
    product_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    buyer_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    seller_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
      required: [true, 'Please add the price of the product'],
    },
    size: {
      type: Number,
      required: [true, 'Please add the size of the product'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add the quantity of the product'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
