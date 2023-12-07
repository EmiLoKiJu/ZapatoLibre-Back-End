const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const OrderItem = require('../models/orderItemModel');

// @desc create new product
// @route POST /api/products
// @access private

const createOrderItem = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { product_ID } = req.body;
  if (!product_ID) {
    res.status(400);
    throw new Error("Missing product id");
  }

  const product = await Product.findById(product_ID);
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }

  const orderItem = await OrderItem.create({
    product_ID: product._id,
    buyer_ID: req.user.id,
    seller_ID: product.owner_ID,
    price: product.price,
    size: product.size,
    quantity: product.quantity
  });
  res.status(201).json(orderItem);
});

// @desc Get product
// @route GET /api/products/:id
// @access private

const getOrderItem = asyncHandler(async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id);
  if (!orderItem) {
    res.status(404);
    throw new Error('orderItem not found');
  }

  if (orderItem.buyer_ID.toString() !== req.user.id && orderItem.seller_ID.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }
  res.status(200).json(orderItem);
});

module.exports = { createOrderItem, getOrderItem };