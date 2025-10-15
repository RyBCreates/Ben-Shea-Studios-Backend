const Order = require("../models/order");

const createOrder = async (req, res) => {
  try {
    const { customerInfo, cartList, totalAmount, stripeSessionId } = req.body;
    const newOrder = await Order.create({
      ...customerInfo,
      cartList,
      totalAmount,
      stripeSessionId,
      status: "pending",
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
