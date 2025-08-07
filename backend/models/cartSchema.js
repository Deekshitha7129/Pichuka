import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  dishId: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true }
});

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export const Cart = mongoose.model('Cart', cartSchema); 