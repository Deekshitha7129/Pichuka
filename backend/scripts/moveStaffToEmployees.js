import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Customer, Employee } from '../models/employeeSchema.js';

dotenv.config({ path: './config/config.env' });

const staffMembers = [
  {
    name: "John Manager",
    email: "staff001@pichuka.com",
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543210",
    position: "Restaurant Manager"
  },
  {
    name: "Sarah Server",
    email: "staff002@pichuka.com", 
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543211",
    position: "Senior Server"
  },
  {
    name: "Mike Chef",
    email: "staff003@pichuka.com",
    password: "staff123", 
    role: "Employee",
    contact: "+91 9876543212",
    position: "Head Chef"
  },
  {
    name: "Lisa Hostess",
    email: "staff004@pichuka.com",
    password: "staff123",
    role: "Employee", 
    contact: "+91 9876543213",
    position: "Hostess"
  },
  {
    name: "David Bartender",
    email: "staff005@pichuka.com",
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543214", 
    position: "Bartender"
  },
  {
    name: "Emma Server",
    email: "staff006@pichuka.com",
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543215",
    position: "Server"
  },
  {
    name: "Alex Kitchen",
    email: "staff007@pichuka.com", 
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543216",
    position: "Kitchen Staff"
  },
  {
    name: "Maria Cashier",
    email: "staff008@pichuka.com",
    password: "staff123",
    role: "Employee",
    contact: "+91 9876543217",
    position: "Cashier"
  },
  {
    name: "Tom Waiter",
    email: "staff009@pichuka.com",
    password: "staff123", 
    role: "Employee",
    contact: "+91 9876543218",
    position: "Waiter"
  },
  {
    name: "Anna Supervisor",
    email: "staff010@pichuka.com",
    password: "staff123",
    role: "Employee", 
    contact: "+91 9876543219",
    position: "Floor Supervisor"
  }
];

const moveStaffToEmployees = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'RESTAURANT',
    });
    console.log('Connected to Database Successfully!');

    // Remove existing staff from customers collection
    await Customer.deleteMany({ role: 'Employee' });
    console.log('Removed staff members from customers collection');

    // Clear existing employees collection
    await Employee.deleteMany({});
    console.log('Cleared existing employees collection');

    // Add staff members to employees collection
    const createdStaff = await Employee.insertMany(staffMembers);
    console.log(`Successfully added ${createdStaff.length} staff members to employees collection:`);
    
    createdStaff.forEach(staff => {
      console.log(`- ${staff.name} (${staff.email}) - ${staff.position}`);
    });

    console.log('\n=== STAFF LOGIN CREDENTIALS ===');
    console.log('Password for all staff: staff123');
    console.log('\nStaff IDs (emails):');
    staffMembers.forEach(staff => {
      console.log(`- ${staff.email}`);
    });

    // Verify the employees are in the correct collection
    const employees = await Employee.find({});
    console.log(`\nTotal employees in employees collection: ${employees.length}`);

  } catch (error) {
    console.error('Error moving staff members:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from Database');
  }
};

moveStaffToEmployees(); 