import express from 'express';
import { Customer, Employee } from '../models/employeeSchema.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // First check in customers collection
        let user = await Customer.findOne({ email: email });
        
        // If not found in customers, check in employees collection
        if (!user) {
            user = await Employee.findOne({ email: email });
        }
        
        if (user) {
            if (user.password === password) {
                res.json({ message: 'Success', user: user });
            } else {
                res.status(400).json('The password is incorrect');
            }
        } else {
            res.status(404).json('No record Existed');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/register', (req, res) => {
    Customer.create(req.body)
        .then(customer => res.status(201).json(customer))
        .catch(err => {
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                res.status(400).json('Email already exists. Please use a different email.');
            } else {
                res.status(500).json('An error occurred during registration.');
            }
        });
});

export default router;
