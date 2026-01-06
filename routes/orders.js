const router = require("express").Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/ordersController");

router.get("/", getOrders);
router.post("/", createOrder);
router.patch("/:orderId", updateOrderStatus);
router.delete("/:orderId", deleteOrder);

module.exports = router;
