const express = require("express");
const router = express.Router();
const {
  getOrderItems,
  createOrderItem,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require("../controllers/orderItemController");
const validateToken = require('../middleware/validateTokenHandler');

// router.use(validateToken);

router.route("/").get(getOrderItems).post(validateToken, createOrderItem);

router.route("/:id").get(getOrderItem).put(validateToken, updateOrderItem).delete(validateToken, deleteOrderItem);

module.exports = router;
