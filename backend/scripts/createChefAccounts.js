import mongoose from 'mongoose';
import { Employee } from '../models/employeeSchema.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restaurant', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create chef accounts
const createChefAccounts = async () => {
  try {
    // Sample chef accounts
    const chefAccounts = [
      {
        name: 'John Smith',
        email: 'chef@pichuka.com',
        password: 'chef123',
        role: 'Employee',
        position: 'Head Chef',
        specialization: 'Multi-Cuisine',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543210'
      },
      {
        name: 'Sarah Johnson',
        email: 'souschef@pichuka.com',
        password: 'sous123',
        role: 'Employee',
        position: 'Sous Chef',
        specialization: 'Italian Cuisine',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543211'
      },
      {
        name: 'Mike Wilson',
        email: 'kitchenmanager@pichuka.com',
        password: 'kitchen123',
        role: 'Employee',
        position: 'Kitchen Manager',
        specialization: 'Operations Management',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543212'
      }
    ];

    // Sample non-chef staff accounts
    const staffAccounts = [
      {
        name: 'Emma Davis',
        email: 'manager@pichuka.com',
        password: 'manager123',
        role: 'Employee',
        position: 'Manager',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543213'
      },
      {
        name: 'Alex Brown',
        email: 'supervisor@pichuka.com',
        password: 'super123',
        role: 'Employee',
        position: 'Supervisor',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543214'
      },
      {
        name: 'Lisa Garcia',
        email: 'cashier@pichuka.com',
        password: 'cash123',
        role: 'Employee',
        position: 'Cashier',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543215'
      },
      {
        name: 'Tom Martinez',
        email: 'waiter@pichuka.com',
        password: 'waiter123',
        role: 'Employee',
        position: 'Waiter',
        restaurant: 'Pichuka Restaurant',
        contact: '+91-9876543216'
      }
    ];

    // Combine all accounts
    const allAccounts = [...chefAccounts, ...staffAccounts];

    console.log('🔄 Creating employee accounts...');

    for (const account of allAccounts) {
      try {
        // Check if account already exists
        const existingEmployee = await Employee.findOne({ email: account.email });
        
        if (existingEmployee) {
          console.log(`⚠️  Account already exists: ${account.email} (${account.position})`);
        } else {
          // Create new employee account
          const newEmployee = await Employee.create(account);
          console.log(`✅ Created ${account.position}: ${account.email} | Password: ${account.password}`);
        }
      } catch (error) {
        console.error(`❌ Error creating account ${account.email}:`, error.message);
      }
    }

    console.log('\n📋 CHEF LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    chefAccounts.forEach(chef => {
      console.log(`👨‍🍳 ${chef.position}: ${chef.email} | Password: ${chef.password}`);
    });

    console.log('\n📋 STAFF LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    staffAccounts.forEach(staff => {
      console.log(`👥 ${staff.position}: ${staff.email} | Password: ${staff.password}`);
    });

    console.log('\n🎯 LOGIN INSTRUCTIONS:');
    console.log('1. Go to login page and select "Staff" login');
    console.log('2. Use email as Staff ID (e.g., chef@pichuka.com)');
    console.log('3. Enter the corresponding password');
    console.log('4. Chefs will be redirected to Chef Dashboard');
    console.log('5. Other staff will be redirected to Staff Dashboard');

  } catch (error) {
    console.error('❌ Error creating accounts:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createChefAccounts();
  
  console.log('\n✅ Account creation completed!');
  process.exit(0);
};

// Run the script
main().catch(error => {
  console.error('❌ Script error:', error);
  process.exit(1);
});
