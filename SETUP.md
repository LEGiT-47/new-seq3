# Sequeira Foods E-Commerce Platform - Setup Guide

This guide will help you set up and run the complete Sequeira Foods e-commerce platform locally.

## Project Structure

```
sequeira-foods/
├── frontend/              # React Vite application
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── backend/              # Express.js + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── SETUP.md             # This file
```

## Prerequisites

- Node.js 16+ (v18 recommended)
- npm 8+ or yarn 3+
- Git
- MongoDB Atlas account (cloud database)
- VS Code or any code editor

## Step 1: Database Setup (MongoDB Atlas)

Your MongoDB connection URL:
```
mongodb+srv://virajprabhu47:V6lleOGZBAdrEToW@cluster0.rskn6q9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**Important:** Save this URL locally. It will be used in backend `.env` file.

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 2.2 Configure Environment

Create `.env.local` file in the frontend directory:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL (local development)
REACT_APP_API_URL=http://localhost:5000/api

# WhatsApp Configuration
REACT_APP_WHATSAPP_NUMBER=+919930709557
```

### 2.3 Run Frontend Development Server

```bash
npm run dev
# or
yarn dev
```

Frontend will be available at: **http://localhost:5173**

## Step 3: Backend Setup

### 3.1 Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
# or
yarn install
```

### 3.2 Configure Environment

Create `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://virajprabhu47:V6lleOGZBAdrEToW@cluster0.rskn6q9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secrets (generate random strings)
JWT_SECRET=your_random_user_jwt_secret_key_here
ADMIN_JWT_SECRET=your_random_admin_jwt_secret_key_here

# Razorpay Keys (leave empty for now, fill when account is ready)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Server Config
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# WhatsApp Number
WHATSAPP_NUMBER=+919930709557
```

### 3.3 Seed Database (Initialize Admin & Products)

```bash
# From backend directory
npm run seed
```

This will:
- Create the admin user (Username: `Ravi@admin`, Password: `seq@Foods1234`)
- Add all 36 products with deliverable/non-deliverable flags

### 3.4 Run Backend Server

```bash
# Development mode with auto-reload
npm run dev

# or production mode
npm start
```

Backend will be available at: **http://localhost:5000**

## Step 4: Verify Setup

### Frontend Verification

1. Navigate to `http://localhost:5173`
2. You should see the Sequeira Foods homepage
3. Test navigation through Products section
4. Verify all product categories are displaying

### Backend Verification

1. Check health endpoint: `http://localhost:5000/api/health`
2. You should get a JSON response with status "Server is running"

### Database Verification

1. Log in to MongoDB Atlas
2. Navigate to Collections
3. Verify these collections exist:
   - `admins` (with Ravi@admin user)
   - `products` (with 36 products)
   - `users` (empty initially)
   - `orders` (empty initially)
   - `paymenttransactions` (empty initially)

## Step 5: Testing Key Features

### Test User Registration & Login

1. Go to `http://localhost:5173`
2. Look for Login/Signup button
3. Create a new account
4. Test login

### Test Admin Dashboard

1. Navigate to `http://localhost:5173/admin/login`
2. Login with:
   - Username: `Ravi@admin`
   - Password: `seq@Foods1234`
3. You should see the Admin Dashboard with:
   - Analytics cards (Orders, Revenue, etc.)
   - Orders list with filters
   - Status management

### Test Product Browsing

1. Navigate to Products section
2. Verify products are categorized correctly
3. Test filters and category navigation
4. Click on a product to see detailed page

### Test Deliverable Products Flow

1. Browse "Dry Fruits" category (deliverable products)
2. Add product to cart
3. Go to Checkout
4. Fill delivery address
5. Click "Continue to Payment" (Razorpay button will appear when account is ready)

### Test Non-Deliverable Products

1. Browse "Chocolates" or other non-deliverable categories
2. Click "Enquire on WhatsApp"
3. Should open WhatsApp with pre-filled message

## Product Segmentation

### Deliverable Products (Online Payment Enabled)
- **Dry Fruits** (Category ID: 21-52)
  - California Almonds
  - Indian Konkan Cashew
  - California Pistachio
  - Makhana (Fox Nuts)
  - And other dry fruits

### Non-Deliverable Products (WhatsApp Enquiry Only)
- **Chocolates** (8 products)
- **Flavored Nuts** (6 products)
- **Jaggery Coated** (5 products)
- **Seeds** (6 products)
- **Gifting Solutions** (7 products)
- **Services** (4 products)

## API Endpoints Overview

### User Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/profile` - Get admin profile
- `GET /api/admin/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get by category
- `GET /api/products/deliverable/list` - Get deliverable products

### Orders & Payment
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders/payment/initiate` - Initiate Razorpay payment
- `POST /api/orders/payment/verify` - Verify payment

### Admin Dashboard
- `GET /api/admin/orders` - Get all orders (with filters)
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/orders/analytics/dashboard` - Analytics data
- `GET /api/admin/orders/delivery/overview` - Delivery status overview

## Razorpay Integration (When Ready)

When you have your Razorpay account ready:

1. Get API keys from Razorpay Dashboard
2. Update backend `.env`:
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
3. Restart backend server
4. Test payment flow on checkout page

## Security Features Implemented

- Password hashing with bcryptjs
- JWT-based authentication (separate for user and admin)
- CORS configuration
- Rate limiting (login attempts, payment attempts)
- Input validation with Joi
- Helmet for HTTP headers
- Payment attempt deduplication
- Admin token verification

## Important Notes

1. **MongoDB Connection**: The provided URL connects to the dev database. Change it if using a different cluster.

2. **JWT Secrets**: Generate strong random strings for production:
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **WhatsApp Number**: Update `WHATSAPP_NUMBER` in backend `.env` if different.

4. **CORS**: Currently configured for `http://localhost:5173`. Update `FRONTEND_URL` when deploying.

5. **Email Notifications**: Currently manual (via WhatsApp). Email integration can be added later.

## Deployment Instructions (Future)

- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas (already set up)

Detailed deployment guides will be provided when ready.

## Troubleshooting

### Backend won't start
- Check MongoDB connection URL is correct
- Verify PORT 5000 is not in use
- Check all environment variables are set

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env.local`
- Check browser console for CORS errors

### Products not showing
- Run `npm run seed` in backend to initialize data
- Check MongoDB collections are created
- Verify backend is responding to `/api/products`

### Admin login failing
- Verify database seeding completed
- Check username is `Ravi@admin` and password is `seq@Foods1234`
- Restart backend server

## Support

For issues or questions, check:
1. Console logs (browser and terminal)
2. Network requests in browser DevTools
3. MongoDB Atlas logs
4. Backend server logs

---

**Setup completed! You're ready to run Sequeira Foods platform locally.**

Start both frontend and backend servers and visit `http://localhost:5173` to access the platform.
