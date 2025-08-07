import express from 'express';
import { placeOrder, getOrderHistory, getAllOrders, updateOrderStatus, getOrderStatus, markAsDelivered } from '../controller/order.js';
const router = express.Router();

router.post('/place', placeOrder);
router.get('/history', getOrderHistory);
router.get('/all', getAllOrders);
router.put('/status', updateOrderStatus);
router.put('/mark-delivered', markAsDelivered); // Employee-only delivery action
router.get('/status/:orderId', getOrderStatus);

export default router;