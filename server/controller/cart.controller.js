import Cart from "../model/cart.model.js";
import { Product } from "../model/product.model.js";

export const addToCart = async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({
        customerId,
        items: [
          {
            productId,
            quantity,
            priceAtTime: product.price,
          },
        ],
        totalQuantity: quantity,
        totalPrice: product.price * quantity,
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          priceAtTime: product.price,
        });
      }

      // Recalculate totals
      cart.totalQuantity += quantity;
      cart.totalPrice += product.price * quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const viewCart = async (req, res) => {
  const customerId = req.user.id;

  try {
    const cart = await Cart.findOne({ customerId }).populate({
      path: "items.productId",
      select: "name price imageUrl seller", // include seller in first populate
      populate: {
        path: "seller",
        model: "Seller", // match your model name
        select: "username email imageUrl", // add whatever fields you want
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: null });
    }

    res.status(200).json({
      success: true,
      message: "Cart Items retrieved successfully",
      data: cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching cart", error });
  }
};

export const removeFromCart = async (req, res) => {
  const customerId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not found in cart" });

    const item = cart.items[itemIndex];

    // Update totals
    cart.totalQuantity -= item.quantity;
    cart.totalPrice -= item.priceAtTime * item.quantity;

    // Remove item
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
