const express = require("express");
const router = express.Router();
const {
  createOrderItem,
  getOrderItem,
} = require("../controllers/orderItemController");
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route("/").post(createOrderItem);

router.route("/:id").get(getOrderItem);

module.exports = router;
