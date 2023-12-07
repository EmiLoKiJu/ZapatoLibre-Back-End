const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const User = require('../models/userModel');
const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');

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
    price: product.price,
    size: product.size,
    quantity: product.quantity
  });
  const currentUser = await User.findById(req.user.id);
  currentUser.products.push(product._id);
  console.log('product id: ', product._id);
  console.log('current user', currentUser);
  await currentUser.save();
  res.status(201).json(product);
});

// @desc Get product
// @route GET /api/products/:id
// @access private

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }
  // if (product.user_id.toString() !== req.user.id) {
  //   res.status(403);
  //   throw new Error('User do not have permission to do that');
  // }
  res.status(200).json(product);
});

// @desc update product
// @route PUT /api/products/:id
// @access private

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }
  const currentUser = await User.findById(req.user.id);
  
  if (!currentUser.products.includes(req.params.id)) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedProduct);
});

// @desc delete product
// @route DELETE /api/products/:id
// @access private

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log(product);
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }
  const currentUser = await User.findById(req.user.id);
  
  if (!currentUser.products.includes(req.params.id)) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }
  await Product.deleteOne({ _id: req.params.id });
  currentUser.splice(currentUser.products.indexOf(req.params.id), 1);
  await currentUser.save();
  res.status(200).json(product);
});

module.exports = { createProduct, getProduct, updateProduct, getProducts, deleteProduct };