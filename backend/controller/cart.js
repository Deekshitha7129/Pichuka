import { Cart } from '../models/cartSchema.js';

// Add or update an item in the user's cart
export const addToCart = async (req, res) => {
  const { email, item } = req.body;
  if (!email || !item) {
    return res.status(400).json({ message: 'Email and item are required.' });
  }
  try {
    let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = await Cart.create({ email, items: [item] });
    } else {
      const existingItem = cart.items.find(i => i.dishId === item.dishId);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        cart.items.push(item);
      }
      cart.updatedAt = Date.now();
      await cart.save();
    }
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Get the user's cart
export const getCart = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    const cart = await Cart.findOne({ email });
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// Remove an item from the user's cart
export const removeFromCart = async (req, res) => {
  const { email, dishId } = req.body;
  if (!email || dishId === undefined) {
    return res.status(400).json({ message: 'Email and dishId are required.' });
  }
  try {
    const cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }
    cart.items = cart.items.filter(i => i.dishId !== dishId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
}; 