# 🍕 PizzaExpress - Online Pizza Ordering System

A full-stack MERN (MongoDB, Express, React, Node.js) pizza ordering application with modern UI, JWT authentication, Redux state management, and comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, Login, JWT-based authentication
- **Menu Browsing**: Browse pizzas with categories, search, and filters
- **Pizza Customization**: Choose size, crust, and extra toppings
- **Shopping Cart**: Add/remove items, quantity management, promo codes
- **Checkout**: Multi-step checkout with delivery info and payment selection
- **Order Tracking**: Real-time order status tracking
- **User Dashboard**: Order history, profile management, favorites

### Admin Features
- **Dashboard**: Revenue stats, order overview, recent orders
- **Order Management**: Update order status, view order details
- **Pizza Management**: Add, edit, delete pizzas with full customization
- **User Management**: View and manage users

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router DOM 6** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 10** - Animations
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Chart.js** - Analytics charts

## 📁 Project Structure

```
Online-Pizza-Ordering-System/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux slices and store
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd Online-Pizza-Ordering-System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**

   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   App runs on http://localhost:3000

## 🔑 Demo Credentials

### Admin Account
- Email: admin@pizzaexpress.com
- Password: admin123

### User Account
- Email: user@example.com
- Password: user123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pizzas
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas/:id` - Get pizza by ID
- `POST /api/pizzas` - Create pizza (admin)
- `PUT /api/pizzas/:id` - Update pizza (admin)
- `DELETE /api/pizzas/:id` - Delete pizza (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon code

### Reviews
- `GET /api/reviews/:pizzaId` - Get reviews for pizza
- `POST /api/reviews` - Add review

## 🎨 UI Features

- **Dark Theme**: Modern dark mode design
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions with Framer Motion
- **Toast Notifications**: User feedback with React Toastify
- **Loading States**: Skeleton loaders and spinners

## 📄 License

This project is for educational purposes.

---

Built with ❤️ using MERN Stackza Ordering System

A full-stack MERN (MongoDB, Express, React, Node.js) pizza ordering application with modern UI, JWT authentication, Redux state management, and comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, Login, JWT-based authentication
- **Menu Browsing**: Browse pizzas with categories, search, and filters
- **Pizza Customization**: Choose size, crust, and extra toppings
- **Shopping Cart**: Add/remove items, quantity management, promo codes
- **Checkout**: Multi-step checkout with delivery info and payment selection
- **Order Tracking**: Real-time order status tracking
- **User Dashboard**: Order history, profile management, favorites

### Admin Features
- **Dashboard**: Revenue stats, order overview, recent orders
- **Order Management**: Update order status, view order details
- **Pizza Management**: Add, edit, delete pizzas with full customization
- **User Management**: View and manage users

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router DOM 6** - Routing
- **Redux Toolkit** - State management
- **Tailwind CSS 3.4** - Styling
- **Framer Motion 10** - Animations
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Chart.js** - Analytics charts

## 📁 Project Structure

```
Online-Pizza-Ordering-System/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux slices and store
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd Online-Pizza-Ordering-System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**

   Create `.env` file in backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   App runs on http://localhost:3000

## 🔑 Demo Credentials

### Admin Account
- Email: admin@pizzaexpress.com
- Password: admin123

### User Account
- Email: user@example.com
- Password: user123

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pizzas
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas/:id` - Get pizza by ID
- `POST /api/pizzas` - Create pizza (admin)
- `PUT /api/pizzas/:id` - Update pizza (admin)
- `DELETE /api/pizzas/:id` - Delete pizza (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Coupons
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons/validate` - Validate coupon code

### Reviews
- `GET /api/reviews/:pizzaId` - Get reviews for pizza
- `POST /api/reviews` - Add review

## 🎨 UI Features

- **Dark Theme**: Modern dark mode design
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions with Framer Motion
- **Toast Notifications**: User feedback with React Toastify
- **Loading States**: Skeleton loaders and spinners

## 📄 License

This project is for educational purposes.

---

Built with ❤️ using MERN Stack