import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controller/cart.js';
const router = express.Router();

router.post('/add', addToCart);
router.get('/', getCart);
router.post('/remove', removeFromCart);

export default router; 