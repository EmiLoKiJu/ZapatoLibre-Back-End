const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const val = require('../validations');

// @desc post register user
// @route POST /api/users/register
// @access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }
  if (!val.thisString(username) || !val.thisString(email) || !val.thisString(password)) {
    res.status(400);
    throw new Error("Some data is missing or is corrupted.");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error('User already registered');
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('hashed password: ', hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`user created successfully: ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error('user data is not valid');
  }
});

// @desc post login user
// @route POST /api/users/login
// @access public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }
  if (!val.thisString(email) || !val.thisString(password)) {
    res.status(400);
    throw new Error("Some data is missing or is corrupted.");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10000m' }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error('invalid credentials');
  }
});

// @desc Get current user
// @route GET /users/current
// @access private

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
    products: user.products,
    orders: user.orders
  };
  res.status(200).json(userData);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('user not found');
  }
  await User.deleteOne({ _id: req.user.id });
  res.status(200).json({ title: "user deleted", user: req.user });
});

module.exports = { registerUser, loginUser, currentUser, deleteUser };
