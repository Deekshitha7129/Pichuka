// Initialize MongoDB with a user for the application
db = db.getSiblingDB('RESTAURANT');

db.createUser({
  user: 'pichuka',
  pwd: 'pichuka123', // In production, use environment variables for these values
  roles: [
    {
      role: 'readWrite',
      db: 'RESTAURANT',
    },
  ],
});

// Create initial collections with validation
const collections = ['users', 'reservations', 'orders', 'menu'];

collections.forEach((collectionName) => {
  db.createCollection(collectionName, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [],
        properties: {},
      },
    },
    validationLevel: 'strict',
    validationAction: 'error',
  });
});

// Create indexes for better query performance
db.users.createIndex({ email: 1 }, { unique: true });
db.reservations.createIndex({ date: 1, time: 1 });
db.orders.createIndex({ userId: 1, status: 1 });

// Log success
print('MongoDB initialized successfully');
