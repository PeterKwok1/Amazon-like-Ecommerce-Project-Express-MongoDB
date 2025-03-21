import express from "express";
import { isAuth } from "../utils.js";
import Order from "../models/orderModel.js";

const orderRouter = express.Router();

orderRouter.get("/mine", isAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});
orderRouter.get("/:id", isAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ error: "Sorry, could not find order." });
  }
});

orderRouter.post("/", isAuth, async (req, res) => {
  try {
    const order = new Order({
      orderItems: req.body.orderItems,
      user: req.user._id,
      shipping: req.body.shipping,
      payment: req.body.payment,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: req.body.totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: "New Order Created", order: createdOrder });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

export default orderRouter;
