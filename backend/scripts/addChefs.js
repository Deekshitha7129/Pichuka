import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Employee } from '../models/employeeSchema.js';

dotenv.config({ path: './config/config.env' });

const chefs = [
  {
    name: "Chef Rajesh Kumar",
    email: "chef001@pichuka.com",
    password: "chef123",
    role: "Chef",
    contact: "+91 9876543201",
    position: "Head Chef",
    specialization: "Indian Cuisine"
  },
  {
    name: "Chef Maria Rodriguez",
    email: "chef002@pichuka.com",
    password: "chef123",
    role: "Chef",
    contact: "+91 9876543202",
    position: "Sous Chef",
    specialization: "Italian Cuisine"
  },
  {
    name: "Chef Wei Chen",
    email: "chef003@pichuka.com",
    password: "chef123",
    role: "Chef",
    contact: "+91 9876543203",
    position: "Pastry Chef",
    specialization: "Desserts & Pastries"
  },
  {
    name: "Chef James Wilson",
    email: "chef004@pichuka.com",
    password: "chef123",
    role: "Chef",
    contact: "+91 9876543204",
    position: "Grill Chef",
    specialization: "Grilled & BBQ"
  }
];

const addChefs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'RESTAURANT',
    });
    console.log('Connected to Database Successfully!');

    // Clear existing chefs to avoid duplicates
    await Employee.deleteMany({ role: 'Chef' });
    console.log('Cleared existing chefs');

    // Add new chefs
    const createdChefs = await Employee.insertMany(chefs);
    console.log(`Successfully added ${createdChefs.length} chefs:`);
    
    createdChefs.forEach(chef => {
      console.log(`- ${chef.name} (${chef.email}) - ${chef.position} - ${chef.specialization}`);
    });

    console.log('\nChef Login Credentials:');
    console.log('Password for all chefs: chef123');
    console.log('\nChef IDs (emails):');
    chefs.forEach(chef => {
      console.log(`- ${chef.email}`);
    });

  } catch (error) {
    console.error('Error adding chefs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from Database');
  }
};

addChefs(); 