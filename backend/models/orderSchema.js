import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  dishId: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  orderId: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String, default: 'System' }
  }],
  estimatedDeliveryTime: { type: Date },
  notes: { type: String },
  // Delivery tracking fields
  deliveredAt: { type: Date },
  deliveredBy: {
    email: { type: String },
    role: { type: String },
    position: { type: String },
    timestamp: { type: Date }
  }
});

export const Order = mongoose.model('Order', orderSchema); 