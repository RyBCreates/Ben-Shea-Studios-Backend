const Order = require("../models/order");

const createOrder = async (req, res) => {
  try {
    const { customerInfo, cartList, stripeSessionId } = req.body;

    const subtotal = cartList.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const TAX_RATE = 0.07;
    const tax = Number((subtotal * TAX_RATE).toFixed(2));

    const totalAmount = Number((subtotal + tax).toFixed(2));

    const newOrder = await Order.create({
      ...customerInfo,
      cartList,
      subtotal,
      tax,
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

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted", orderId });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, deleteOrder };
