import { Order } from '../models/orderSchema.js';
import { Cart } from '../models/cartSchema.js';

// Place an order (checkout)
export const placeOrder = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  
  try {
    // Get user's cart
    const cart = await Cart.findOne({ email });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Calculate total price
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new order
    const order = await Order.create({
      email,
      items: cart.items,
      totalPrice,
      orderId
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ 
      success: true, 
      message: 'Order placed successfully!',
      order 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
};

// Get order history for a user
export const getOrderHistory = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  
  try {
    const orders = await Order.find({ email }).sort({ orderDate: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order history', error: err.message });
  }
};

// Get all orders (for staff dashboard)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { orderId, status, notes, updatedBy } = req.body;
  
  if (!orderId || !status) {
    return res.status(400).json({ message: 'Order ID and status are required.' });
  }

  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Add to status history
    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      updatedBy: updatedBy || 'System'
    });

    // Update current status
    order.status = status;
    if (notes) order.notes = notes;

    // Set estimated delivery time based on status
    if (status === 'Confirmed') {
      order.estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes
    } else if (status === 'Preparing') {
      order.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    } else if (status === 'Ready') {
      order.estimatedDeliveryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }

    await order.save();

    res.status(200).json({ 
      success: true, 
      message: `Order status updated to ${status}`,
      order 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

// Mark order as delivered (Employee-only action)
export const markAsDelivered = async (req, res) => {
  const { orderId, userEmail, userRole, userPosition } = req.body;
  
  // Validate required fields
  if (!orderId || !userEmail || !userRole || !userPosition) {
    return res.status(400).json({ 
      success: false,
      message: 'Order ID, user email, role, and position are required.' 
    });
  }

  // Role-based access control: Only employees with specific positions can mark as delivered
  const allowedPositions = ['Manager', 'Supervisor', 'Cashier', 'Waiter'];
  if (userRole !== 'Employee' || !allowedPositions.includes(userPosition)) {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Only staff members (Manager, Supervisor, Cashier, Waiter) can mark orders as delivered.' 
    });
  }

  try {
    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found.' 
      });
    }

    // Check if order is in 'Ready' status (can only deliver ready orders)
    if (order.status !== 'Ready') {
      return res.status(400).json({ 
        success: false,
        message: `Cannot mark order as delivered. Current status: ${order.status}. Only 'Ready' orders can be marked as delivered.` 
      });
    }

    // Add to status history
    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      updatedBy: `${userPosition} (${userEmail})`
    });

    // Update status to Delivered
    order.status = 'Delivered';
    order.deliveredAt = new Date();
    order.deliveredBy = {
      email: userEmail,
      role: userRole,
      position: userPosition,
      timestamp: new Date()
    };

    // Save the updated order
    await order.save();

    res.status(200).json({ 
      success: true, 
      message: 'Order marked as delivered successfully!',
      order: {
        orderId: order.orderId,
        status: order.status,
        deliveredAt: order.deliveredAt,
        deliveredBy: order.deliveredBy
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Error marking order as delivered', 
      error: err.message 
    });
  }
};

// Get order status for customer
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ 
      success: true, 
      order: {
        orderId: order.orderId,
        status: order.status,
        statusHistory: order.statusHistory,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        notes: order.notes,
        totalPrice: order.totalPrice,
        orderDate: order.orderDate
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order status', error: err.message });
  }
}; 