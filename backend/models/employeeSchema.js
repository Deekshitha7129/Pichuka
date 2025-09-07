import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Customer', 'Employee'], default: 'Customer' },
    restaurant: { type: String, default: 'Pichuka Restaurant' },
    contact: { type: String },
    position: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Separate Employee schema for employees collection
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Employee' },
    restaurant: { type: String, default: 'Pichuka Restaurant' },
    contact: { type: String },
    position: { type: String },
    specialization: { type: String },
    assignedOrders: [{ type: String }], // Array of order IDs assigned to this chef
    createdAt: { type: Date, default: Date.now }
});

export const Customer = mongoose.model('Customer', customerSchema);
export const Employee = mongoose.model('Employee', employeeSchema);
