const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  currentUser,
  deleteUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current', validateToken , currentUser);

router.delete('/current', validateToken , deleteUser);

module.exports = router;
