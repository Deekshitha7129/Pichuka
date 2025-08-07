import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Order } from '../models/orderSchema.js';

dotenv.config({ path: './config/config.env' });

const sampleOrders = [
  {
    email: "customer1@gmail.com",
    items: [
      {
        dishId: 1,
        title: "Butter Chicken",
        price: 250,
        quantity: 2,
        image: "/dinner1.jpeg"
      },
      {
        dishId: 2,
        title: "Biryani",
        price: 300,
        quantity: 1,
        image: "/dinner2.png"
      }
    ],
    totalPrice: 800,
    orderId: "ORD-1703123456789-abc123def",
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "Preparing",
    statusHistory: [
      {
        status: "Pending",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedBy: "System"
      },
      {
        status: "Confirmed",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        updatedBy: "John Manager"
      },
      {
        status: "Preparing",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        updatedBy: "Mike Chef"
      }
    ],
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000)
  },
  {
    email: "customer2@gmail.com",
    items: [
      {
        dishId: 3,
        title: "Pizza Margherita",
        price: 400,
        quantity: 1,
        image: "/dinner3.png"
      },
      {
        dishId: 4,
        title: "Pasta Carbonara",
        price: 350,
        quantity: 2,
        image: "/dinner4.png"
      }
    ],
    totalPrice: 1100,
    orderId: "ORD-1703123456790-def456ghi",
    orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: "Ready",
    statusHistory: [
      {
        status: "Pending",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        updatedBy: "System"
      },
      {
        status: "Confirmed",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        updatedBy: "Sarah Server"
      },
      {
        status: "Preparing",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        updatedBy: "Alex Kitchen"
      },
      {
        status: "Ready",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        updatedBy: "Mike Chef"
      }
    ],
    estimatedDeliveryTime: new Date(Date.now() + 10 * 60 * 1000)
  },
  {
    email: "customer3@gmail.com",
    items: [
      {
        dishId: 5,
        title: "Grilled Salmon",
        price: 450,
        quantity: 1,
        image: "/dinner5.png"
      },
      {
        dishId: 6,
        title: "Caesar Salad",
        price: 200,
        quantity: 1,
        image: "/dinner6.png"
      }
    ],
    totalPrice: 650,
    orderId: "ORD-1703123456791-ghi789jkl",
    orderDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        updatedBy: "System"
      }
    ]
  }
];

const addSampleOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'RESTAURANT',
    });
    console.log('Connected to Database Successfully!');

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Add sample orders
    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Successfully added ${createdOrders.length} sample orders:`);
    
    createdOrders.forEach(order => {
      console.log(`- Order ${order.orderId} from ${order.email} - Total: ₹${order.totalPrice}`);
    });

  } catch (error) {
    console.error('Error adding sample orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from Database');
  }
};

addSampleOrders(); 