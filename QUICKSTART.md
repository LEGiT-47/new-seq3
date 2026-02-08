# Sequeira Foods E-Commerce Platform - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (URL already provided)
- Code editor (VS Code recommended)

---

## Step 1: Start Backend (Terminal 1)

```bash
cd backend
npm install
npm run seed      # Initialize admin & products
npm run dev       # Start server on port 5000
```

**Expected Output:**
```
Server running on http://localhost:5000
MongoDB Connected Successfully
36 products created successfully
Admin created successfully
```

---

## Step 2: Start Frontend (Terminal 2)

```bash
npm install
npm run dev       # Start on port 5173
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
```

---

## Step 3: Test the Platform

### 🏠 Homepage
- Navigate to http://localhost:5173
- See hero carousel, occasion banner, and featured products

### 👤 User Registration
1. Click "Login" or "Cart" button
2. Click "Sign Up"
3. Fill: Name, Email, Phone, Password
4. Click "Register"

### 🛍️ Browse Products
1. Go to "Products" page
2. Select category (Dry Fruits, Chocolates, etc.)
3. View products with prices and badges

### 📦 Checkout Flow (Dry Fruits Only)
1. Go to **Dry Fruits** category
2. Click "Add to Cart" on any product
3. Go to Cart
4. Click "Checkout"
5. Fill delivery address
6. Review order
7. Click "Proceed to Payment" (Razorpay placeholder)

### ❓ Non-Deliverable Products
1. Go to **Chocolates** category
2. Click "Enquire on WhatsApp"
3. Opens WhatsApp with pre-filled message

### 🔐 Admin Dashboard
1. Navigate to http://localhost:5173/admin/login
2. **Username:** `Ravi@admin`
3. **Password:** `seq@Foods1234`
4. See:
   - Orders count and revenue
   - All orders with filters
   - Status management
   - Analytics

---

## 📱 Key Features to Test

### ✅ User Registration & Login
```
Demo Credentials (Create your own):
- Email: test@example.com
- Password: Test@1234 (min 6 chars)
```

### ✅ Product Segmentation
- **Deliverable** (Dry Fruits): Show "Buy Now"
- **Non-Deliverable** (Others): Show "Enquire on WhatsApp"

### ✅ Admin Features
- View all orders
- Filter by status/payment
- Update delivery status
- See analytics

### ✅ Occasion Banner
- Shows current seasonal offer
- Links to gifting section

---

## 🔗 Important URLs

| Feature | URL |
|---------|-----|
| Homepage | http://localhost:5173 |
| Products | http://localhost:5173/products |
| Checkout | http://localhost:5173/checkout |
| Admin Login | http://localhost:5173/admin/login |
| Admin Dashboard | http://localhost:5173/admin/dashboard |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 🛠️ Useful Commands

### Backend
```bash
cd backend
npm run dev           # Development mode
npm start            # Production mode
npm run seed         # Reset DB and reinitialize
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

---

## ⚙️ Configuration Files

### Backend `.env` (Auto-configured)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
ADMIN_JWT_SECRET=...
PORT=5000
RAZORPAY_KEY_ID=     # Leave empty for now
RAZORPAY_KEY_SECRET= # Leave empty for now
```

### Frontend `.env.local` (Auto-configured)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create user account
- [ ] Can login with created account
- [ ] Can browse products by category
- [ ] Can add dry fruits to cart
- [ ] Can proceed to checkout
- [ ] Can fill address form
- [ ] Can see order confirmation
- [ ] Can access admin dashboard
- [ ] Can view orders in admin panel
- [ ] Can update order status
- [ ] Can see analytics in admin
- [ ] "Enquire on WhatsApp" opens WhatsApp for non-deliverable products

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill the process and try again
```

### Can't Connect to Database
```bash
# Verify MongoDB connection URL in backend/.env
# Should start with: mongodb+srv://virajprabhu47:...
# Check MongoDB Atlas dashboard for cluster status
```

### Frontend Can't Reach Backend
```bash
# Ensure backend is running (should see "Server running on...")
# Check REACT_APP_API_URL in .env.local
# Open DevTools (F12) → Network tab to see API calls
```

### Admin Login Failing
```bash
# Run: npm run seed (from backend directory)
# This recreates the admin user
# Username: Ravi@admin
# Password: seq@Foods1234
```

---

## 📊 Database Structure

MongoDB Collections:
- `admins` - Admin users
- `users` - Customer accounts
- `products` - Product catalog (36 items)
- `orders` - Customer orders
- `paymenttransactions` - Payment history

---

## 🎁 Test Data

### Admin Account
- **Username:** Ravi@admin
- **Password:** seq@Foods1234

### Products Included
- 11 Dry Fruits (Deliverable)
- 8 Chocolates (Non-deliverable)
- 6 Flavored Nuts
- 5 Jaggery Coated
- 6 Seeds
- 11 Gifting Products
- 4 Gifting Services

### Test Order Flow
1. **Add dry fruit to cart** (only these are deliverable)
2. **Go to checkout**
3. **Fill address:**
   - Name: Test User
   - Phone: 9999999999
   - Street: 123 Test Street
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400001
4. **Click "Proceed to Payment"** (Razorpay integration ready)

---

## 🚀 What's Next

### When Razorpay Account is Ready
1. Get API keys from Razorpay dashboard
2. Update `backend/.env`:
   ```
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   ```
3. Restart backend server
4. Test payment flow

### Deployment
```bash
# Frontend → Netlify
# Backend → Render
# Database → MongoDB Atlas (already configured)
```

See `SETUP.md` for detailed deployment instructions.

---

## 📞 Support

- Check `IMPLEMENTATION_SUMMARY.md` for complete features list
- Check `SETUP.md` for detailed setup instructions
- Monitor console logs for errors
- Check MongoDB Atlas dashboard for data

---

**You're all set! Enjoy testing Sequeira Foods e-commerce platform! 🎉**
