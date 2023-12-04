const mongoose = require('mongoose');
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add the product name'],
    },
    price: {
      type: Number,
      required: [true, 'Please add the price of the product'],
    },
    brand: {
      type: String,
      required: [true, 'Please add the product brand'],
    },
    purpose: {
      type: String,
      required: [true, 'Please add the product purpose'],
    },
    stock: [
      {
        size: {
          type: String,
          required: [true, 'Please add the product size'],
        },
        quantity: {
          type: Number,
          required: [true, 'Please add the quantity of the product in the current size'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
