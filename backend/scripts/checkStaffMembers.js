import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Customer } from '../models/employeeSchema.js';

dotenv.config({ path: './config/config.env' });

const checkStaffMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'RESTAURANT',
    });
    console.log('Connected to Database Successfully!');

    // Check all customers/employees
    const allUsers = await Customer.find({});
    console.log(`Total users in database: ${allUsers.length}`);

    // Check staff members specifically
    const staffMembers = await Customer.find({ role: 'Employee' });
    console.log(`\nStaff members found: ${staffMembers.length}`);
    
    if (staffMembers.length > 0) {
      console.log('\nStaff Members:');
      staffMembers.forEach((staff, index) => {
        console.log(`${index + 1}. ${staff.name} (${staff.email}) - ${staff.position || 'No position'}`);
      });
    } else {
      console.log('\nNo staff members found. Adding them now...');
      
      const newStaffMembers = [
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

      const createdStaff = await Customer.insertMany(newStaffMembers);
      console.log(`Successfully added ${createdStaff.length} staff members!`);
    }

    console.log('\n=== STAFF LOGIN CREDENTIALS ===');
    console.log('Password for all staff: staff123');
    console.log('\nStaff IDs (emails):');
    const currentStaff = await Customer.find({ role: 'Employee' });
    currentStaff.forEach(staff => {
      console.log(`- ${staff.email}`);
    });

  } catch (error) {
    console.error('Error checking staff members:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from Database');
  }
};

checkStaffMembers(); 