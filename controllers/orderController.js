const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel')

// @desc create new product
// @route POST /api/products
// @access private

const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { products_ID } = req.body;
  if (!products_ID || products_ID.length === 0) {
    res.status(400);
    throw new Error("Missing product id");
  }

  const products = await Promise.all(products_ID.map(product_ID => Product.findById(product_ID)));
  if (products.some(product => !product)) {
    res.status(404);
    throw new Error('some or non product found');
  }

  const order = await Order.create({
    products_ID: products_ID
  });
  res.status(201).json(order);
});

// @desc Get product
// @route GET /api/products/:id
// @access private

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('order not found');
  }
  const currentUser = await User.findById(req.user.id);

  if (!currentUser.orders.includes(req.params.id)) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }
  res.status(200).json(order);
});

// @desc delete product
// @route DELETE /api/products/:id
// @access private

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  console.log(order);
  if (!order) {
    res.status(404);
    throw new Error('order not found');
  }
  const currentUser = await User.findById(req.user.id);

  if (!currentUser.orders.includes(req.params.id)) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }

  if (!order.completed) {
    res.status(403);
    throw new Error('order not completed');
  }

  await order.deleteOne({ _id: req.params.id });
  currentUser.splice(currentUser.orders.indexOf(req.params.id), 1);
  await currentUser.save();
  res.status(200).json(order);
});

module.exports = { createOrder, getOrder, deleteOrder };