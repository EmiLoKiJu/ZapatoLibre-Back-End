const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');

// @desc Get all products
// @route GET /api/products
// @access public

const getProducts = asyncHandler(async (req, res) => {
  const products =  await Product.findAll();
  res.status(200).json(products);
});

// @desc create new product
// @route POST /api/products
// @access private

const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, price, brand, purpose } = req.body;
  if (!name || !price || !brand || !purpose) {
    res.status(400);
    throw new Error("all fields are mandatory");
  }

  const product = await Product.create({
    name,
    price,
    brand,
    purpose,
    user_id: req.user.id
  });
  res.status(201).json(product);
});

// @desc Get product
// @route GET /api/products/:id
// @access private

const getProduct = asyncHandler(async (req, res) => {
  const product = await Productt.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('productt not found');
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

  if (product.user_id.toString() !== req.user.id) {
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
  if (!product) {
    res.status(404);
    throw new Error('product not found');
  }

  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json(product);
});

module.exports = { createProduct, getProduct, updateProduct, getProducts, deleteProduct };