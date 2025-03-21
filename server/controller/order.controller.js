import Order from "../model/order.model.js";
import Cart from "../model/cart.model.js";
import { Product } from "../model/product.model.js";

export const createOrderFromCart = async (req, res) => {
  const customerId = req.user.id;
  const { orderId, billingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItem = cart.items[0]; // One item at a time

    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < cartItem.quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient product stock" });
    }

    if (!billingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Billing Address Required" });
    }

    const newOrder = new Order({
      customerId,
      orderId: orderId,
      seller: product.seller, // ✅ fixed: get seller from product
      items: [cartItem],
      billingAddress,
      totalQuantity: cartItem.quantity,
      totalPrice: cartItem.quantity * cartItem.priceAtTime,
      paymentStatus: "Paid",
    });

    product.quantity -= cartItem.quantity;
    await product.save();
    await newOrder.save();

    cart.items = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const createOrderFromBuyNow = async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity, orderId, billingAddress } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: true, message: "Insufficient product stock" });
    }

    if (!billingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Billing Address Required" });
    }

    const priceAtTime = product.price;

    const orderItem = {
      productId,
      quantity,
      priceAtTime,
    };

    const totalQuantity = quantity;
    const totalPrice = priceAtTime * quantity;

    const newOrder = new Order({
      customerId,
      orderId: orderId,
      seller: product.seller,
      items: [orderItem],
      billingAddress,
      totalQuantity,
      totalPrice,
      paymentStatus: "Paid",
    });

    product.quantity -= quantity;
    await product.save();
    await newOrder.save();

    console.log(newOrder, "new Order");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const viewUserOrders = async (req, res) => {
  const customerId = req.user.id;

  try {
    const orders = await Order.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("items.productId");
    res.status(200).json({
      success: true,
      message: "Order Items retreived successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const viewSellerOrders = async (req, res) => {
  const sellerId = req.user.id;
  try {
    const orders = await Order.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Order not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Order Items retreived successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        orderStatus: status,
        isDelivered: status === "Delivered",
        deliveredAt: status === "Delivered" ? new Date() : null,
      },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
