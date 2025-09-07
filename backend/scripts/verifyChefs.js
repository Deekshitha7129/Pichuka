import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Employee } from '../models/employeeSchema.js';

dotenv.config({ path: './config/config.env' });

const verifyChefs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'RESTAURANT',
    });
    console.log('Connected to Database Successfully!');

    // Check all employees
    const allEmployees = await Employee.find({});
    console.log(`\nTotal employees in database: ${allEmployees.length}`);
    
    // Check chefs specifically
    const chefs = await Employee.find({ role: 'Chef' });
    console.log(`\nTotal chefs in database: ${chefs.length}`);
    
    if (chefs.length > 0) {
      console.log('\nChefs found:');
      chefs.forEach(chef => {
        console.log(`- ${chef.name} (${chef.email}) - Role: ${chef.role}`);
      });
    } else {
      console.log('\nNo chefs found!');
    }

    // Test authentication for chef002@pichuka.com
    const testChef = await Employee.findOne({ email: 'chef002@pichuka.com' });
    if (testChef) {
      console.log('\n✅ Test chef found:');
      console.log(`- Name: ${testChef.name}`);
      console.log(`- Email: ${testChef.email}`);
      console.log(`- Role: ${testChef.role}`);
      console.log(`- Password: ${testChef.password}`);
    } else {
      console.log('\n❌ Test chef NOT found!');
    }

    // Check if there are any users with Employee role (old system)
    const oldEmployees = await Employee.find({ role: 'Employee' });
    console.log(`\nUsers with 'Employee' role: ${oldEmployees.length}`);

  } catch (error) {
    console.error('Error verifying chefs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from Database');
  }
};

verifyChefs(); 