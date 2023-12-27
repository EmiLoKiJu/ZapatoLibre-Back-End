const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel')
const OrderItem = require('../models/orderItemModel');
const val = require('../validations');

// @desc create new product
// @route POST /api/products
// @access private

const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error('user not found');
  }

  const { products_data } = req.body;
  if (!products_data || products_data.length === 0) {
    res.status(400);
    throw new Error("Missing product id");
  }

  products_data.forEach(product_data => {
    console.log(product_data);
    console.log(val.thisInt(product_data.quantity));
    if (!val.thisString(product_data.id) || !val.thisInt(product_data.quantity) || !val.thisString(product_data.size)) {
      res.status(400);
      throw new Error("Some data is missing or is corrupted.");
    }
  });

  const products = await Promise.all(products_data.map(async (product_data) => {
    try {
      const product = await Product.findById(product_data.id);
      return product;
    } catch (error) {
      res.status(404);
      throw new Error(`${error}`);
    }
  }));

  products.forEach((product) => {
    if (product.owner_ID == req.user.id) {
      res.status(400);
      throw new Error('You can not buy your own products');
    }
  })  

  console.log("products found");

  const sizeIndexArray = products.map((product, index) => {
    try {
      return product.stock.findIndex((stockItem) => stockItem.size === products_data[index].size);
    } catch (error) {
      // Handle the error here, you can log it or perform any other actions.
      console.error(`Error processing product at index ${index}: ${error.message}`);
      // You might want to return a default value or handle it in a way that suits your application.
      return -1; // Default value indicating an error
    }
  });
  sizeIndexArray.forEach((sizeIndex, index) => {
    if (sizeIndex === -1) {
      res.status(400);
      throw new Error('No valid size');
    }
    if (products[index].stock[sizeIndex].quantity < products_data[index].quantity) {
      res.status(400);
      throw new Error('Insufficient quantity of products');
    }
  });

  console.log("quantities found");

  const orderItems = await Promise.all(products.map(async (product, index) => {
    try {
      const orderItem = await OrderItem.create({
        product_ID: product._id,
        buyer_ID: req.user.id,
        seller_ID: product.owner_ID,
        price: product.price,
        size: products_data[index].size,
        quantity: products_data[index].quantity,
      });
      product.stock[sizeIndexArray[index]].quantity -= products_data[index].quantity;
      await product.save();
      return orderItem._id;
    } catch (error) {
      console.error('Error creating order item:', error);
      res.status(400);
      throw new Error('some or non product could have been created');
    }
  }));

  const order = await Order.create({
    orderItems: orderItems
  });

  currentUser.orders.push(order._id);
  await currentUser.save();
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

const completeOrder = asyncHandler(async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error(`Order not found for id: ${req.params.id}`);
    }
  } catch (error) {
    res.status(404);
    throw new Error(`Order not found. Error: ${error}`);
  }
  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error('user not found');
  }
  if (!currentUser.orders.includes(req.params.id)) {
    res.status(401);
    throw new Error('You can not complete other people order');
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500);
    throw new Error(`Error updating order: ${error}`);
  }
}) 

// @desc delete product
// @route DELETE /api/products/:id
// @access private

const deleteOrder = asyncHandler(async (req, res) => {
  let order;
  try {
    order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error(`Order not found for id: ${req.params.id}`);
    }
  } catch (error) {
    res.status(404);
    throw new Error(`Order not found. Error: ${error}`);
  }
  let currentUser;
  try {
    currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      res.status(404);
      throw new Error('user not found');
    }
  } catch (error) {
    res.status(404);
    throw new Error('user not found');
  }
  if (!currentUser.orders.includes(req.params.id)) {
    res.status(401);
    throw new Error('You can not delete other people order');
  }
  if (!order.completed) {
    res.status(403);
    throw new Error('order not completed');
  }
  await Order.deleteOne({ _id: req.params.id });
  currentUser.orders.splice(currentUser.orders.indexOf(req.params.id), 1);
  await currentUser.save();
  res.status(200).json(order);
});

module.exports = { createOrder, getOrder, completeOrder, deleteOrder };