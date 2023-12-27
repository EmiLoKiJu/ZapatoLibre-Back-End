const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrder,
  completeOrder,
  deleteOrder,
} = require("../controllers/orderController");
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.route("/").post(createOrder);

router.route("/:id").get(getOrder).put(completeOrder).delete(deleteOrder);

module.exports = router;
