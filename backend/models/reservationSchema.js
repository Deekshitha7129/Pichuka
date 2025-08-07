import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must contain 3 characters!"],
        maxLength: [30, "First name cannot exceed 30 characters!"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must contain 3 characters!"],
        maxLength: [30, "Last name cannot exceed 30 characters!"]
    },
    email: {
        type: String,
        required: true,
        validate: { 
            validator: validator.isEmail, 
            message: "Provide a Valid Email!" 
        }
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone number must contain only 10 digits!"],
        maxLength: [10, "Phone number must contain only 10 digits!"]
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        default: 'Pichuka Restaurant'
    },
    status: {
        type: String,
        default: 'Confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Reservation = mongoose.model("Reservation", reservationSchema);