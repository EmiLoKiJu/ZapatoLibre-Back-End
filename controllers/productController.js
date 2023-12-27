const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const User = require('../models/userModel');
const val = require('../validations');

// @desc Get all products
// @route GET /api/products
// @access public

function validateStock(stock) {
  if (!Array.isArray(stock)) {
    return false;
  }

  return stock.every(item => {
    return (
      typeof item === 'object' &&
      item.hasOwnProperty('size') &&
      val.thisString(item.size) &&
      item.hasOwnProperty('quantity') &&
      val.thisIntWith0(item.quantity)
    );
  });
}

const getProducts = asyncHandler(async (req, res) => {
  const products =  await Product.find();
  res.status(200).json(products);
});

// @desc create new product
// @route POST /api/products
// @access private

const createProduct = asyncHandler(async (req, res) => {
  console.log('user id: ', req.user.id);
  const { name, price, brand, purpose, stock } = req.body;

  if (!val.thisString(name) || !val.thisNumber(price) || !val.thisString(brand) || !val.thisString(purpose) || !validateStock(stock)) {
    res.status(400);
    throw new Error("Some data is missing or is corrupted.");
  }

  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error('user not found');
  }

  const product = await Product.create({
    owner_ID: req.user.id,
    name,
    price,
    brand,
    purpose,
    stock,
  });
  currentUser.products.push(product._id);
  console.log('product id: ', product._id);
  await currentUser.save();
  res.status(201).json(product);
  console.log('current user updated', currentUser);
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
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('product not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Product not found.');
  }
  
  console.log('product owner id: ', product.owner_ID.toString());
  console.log('request user id: ', req.user.id);
  
  if (product.owner_ID.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }

  const { name, price, brand, purpose, stock } = req.body;

  if (
    (name && !val.thisString(name)) ||
    (price && !val.thisNumber(price)) ||
    (brand && !val.thisString(brand)) ||
    (purpose && !val.thisString(purpose)) ||
    (stock && !validateStock(stock))
  ) {
    res.status(400);
    throw new Error("Some data is missing or is corrupted.");
  }

  const updatedFields = {};
  if (name) updatedFields.name = name;
  if (price) updatedFields.price = price;
  if (brand) updatedFields.brand = brand;
  if (purpose) updatedFields.purpose = purpose;
  if (stock) updatedFields.stock = stock;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true }
  );

  res.status(200).json(updatedProduct);
});

// @desc delete product
// @route DELETE /api/products/:id
// @access private

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // console.log(product);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('product not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('Product not found.');
  }

  if (product.owner_ID.toString() !== req.user.id) {
    res.status(403);
    throw new Error('User do not have permission to do that');
  }

  const currentUser = await User.findById(req.user.id);
  console.log(currentUser);
  await Product.deleteOne({ _id: req.params.id });

  const productIndex = currentUser.products.indexOf(req.params.id);
  if (productIndex !== -1) {
    currentUser.products.splice(productIndex, 1);
  }
  console.log(currentUser);
  await currentUser.save();
  res.status(200).json(product);
});

module.exports = { createProduct, getProduct, updateProduct, getProducts, deleteProduct };