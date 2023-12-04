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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
