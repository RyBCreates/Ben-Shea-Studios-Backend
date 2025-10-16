const router = require("express").Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/ordersController");

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:orderId", updateOrderStatus);

module.exports = router;
