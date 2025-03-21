import Cart from "../model/cart.model.js"
import Product from "../model/product.model.js"

export const addToCart = async (req, res) => {
  const { customerId } = req.user; // assuming middleware adds authenticated user
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
      cart = new Cart({
        customerId,
        items: [{
          productId,
          quantity,
          priceAtTime: product.price
        }],
        totalQuantity: quantity,
        totalPrice: product.price * quantity
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          priceAtTime: product.price
        });
      }

      // Recalculate totals
      cart.totalQuantity += quantity;
      cart.totalPrice += product.price * quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeFromCart = async (req, res) => {
  const { customerId } = req.user;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ customerId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    const item = cart.items[itemIndex];

    // Update totals
    cart.totalQuantity -= item.quantity;
    cart.totalPrice -= item.priceAtTime * item.quantity;

    // Remove item
    cart.items.splice(itemIndex, 1);

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

