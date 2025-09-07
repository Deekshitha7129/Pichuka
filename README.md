# Pichuka Restaurant Booking System

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)


## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

## Introduction
**Pichuka** is a multi-cuisine restaurant booking system founded by **Deekshitha Burugupalli**. This project allows customers to make online reservations for our diverse culinary experience. It features a backend built with Node.js, Express, and MongoDB, and a frontend built with React.

## Features
- User registration and login for employees
- Make and manage reservations
- Multi-cuisine restaurant experience
- Responsive design with dark theme
- Real-time database updates

## Technologies Used
- **Frontend:** React, React Router, react-hot-toast, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (Local Installation)
- **Styling:** CSS with modern dark theme

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine
- MongoDB instance running locally (already configured)

## Installation
1. Clone the repository:
    ```sh
    git clone <your-repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd Restraunt-Booking-System-main
    ```

### Backend Setup
1. Navigate to the backend directory:
    ```sh
    cd backend
    ```
2. The `.env` file is already configured in `backend/config/config.env`:
    ```sh
    PORT = 3000
    FRONTEND_URL = http://localhost:5173
    MONGO_URI = mongodb://localhost:27017/pichuka-restaurant
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the backend server:
    ```sh
    npm run dev
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```sh
    cd WebFrontend
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Start the frontend development server:
    ```sh
    npm run dev
    ```

## Usage
- Live Demo: [Pichuka Multi-Cuisine Restaurant](https://pichuka-mern.vercel.app)
- Open your browser and navigate to `http://localhost:5173`.
- You can register as an employee and log in.
- Make a reservation through the provided form.
- All data is stored in your local MongoDB database.

## API Endpoints
### Employee Endpoints
- **POST /api/v1/auth/register**: Register a new employee
  - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
- **POST /api/v1/auth/login**: Login an employee
  - Request Body: `{ "email": "string", "password": "string" }`

### Reservation Endpoints
- **POST /api/v1/reservation**: Send a reservation
  - Request Body: `{ "firstName": "string", "lastName": "string", "email": "string", "phone": "string", "date": "string", "time": "string" }`

## Database Monitoring
To monitor your database and see real-time updates:
1. Open MongoDB Compass or use MongoDB shell
2. Connect to: `mongodb://localhost:27017/pichuka-restaurant`
3. Collections: `employees`, `reservations`

## Folder Structure
```sh
Restraunt-Booking-System-main/
├── backend/
│   ├── config/
│   │   └── config.env
│   ├── controller/
│   │   └── reservation.js
│   ├── database/
│   │   └── dbConnection.js
│   ├── error/
│   │   └── error.js
│   ├── models/
│   │   ├── reservationSchema.js
│   │   └── employeeSchema.js
│   ├── routes/
│   │   ├── reservationRoutes.js
│   │   └── authRoutes.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── WebFrontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── Pages/
│   │   │   ├── Success.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── restApi.json
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Owner
**Deekshitha Burugupalli** - Founder & Head Chef of Pichuka Restaurant

## License
© 2024 Pichuka Restaurant. All Rights Reserved.
