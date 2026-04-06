# Parking Management System - Implementation Details

## Project Overview
A full-stack web application for managing parking slots, bookings, and payments with role-based access control (User and Admin).

---

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **UI Icons**: Lucide React 0.300.0
- **QR Code**: qrcode.react 3.1.0
- **Styling**: CSS (index.css)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **Database**: MySQL 2 (via mysql2 3.20.0)
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcrypt 6.0.0
- **CORS**: cors 2.8.6
- **Environment Variables**: dotenv 17.4.0

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Railway (MySQL)

---

## Architecture

### System Architecture
```
Client (React) → API (Express) → Database (MySQL)
     ↓              ↓                  ↓
  Vercel         Render            Railway
```

### Database Schema

#### 1. Users Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password_hash (VARCHAR 255)
- role (ENUM: 'user', 'admin')
- location (VARCHAR 255) - for admin parking locations
- created_at (TIMESTAMP)
```

#### 2. ParkingSlots Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- slot_number (VARCHAR 50)
- status (ENUM: 'available', 'occupied', 'maintenance')
- type (ENUM: 'car', 'bike')
- admin_id (INT, FOREIGN KEY → Users.id)
```

#### 3. Bookings Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- user_id (INT, FOREIGN KEY → Users.id)
- slot_id (INT, FOREIGN KEY → ParkingSlots.id)
- start_time (DATETIME)
- end_time (DATETIME)
- vehicle_number (VARCHAR 50)
- status (ENUM: 'active', 'completed', 'cancelled')
- qr_code_data (VARCHAR 255)
- created_at (TIMESTAMP)
```

#### 4. Payments Table
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- booking_id (INT, FOREIGN KEY → Bookings.id)
- amount (DECIMAL 10,2)
- status (ENUM: 'pending', 'completed', 'failed')
- payment_date (TIMESTAMP)
```

---

## Backend Implementation

### Project Structure
```
backend/
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   ├── user.controller.js    # User operations
│   └── admin.controller.js   # Admin operations
├── middleware/
│   └── authMiddleware.js     # JWT verification
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── user.routes.js        # User endpoints
│   └── admin.routes.js       # Admin endpoints
├── .env                      # Environment variables
├── package.json
└── server.js                 # Entry point
```

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user/admin
- `POST /login` - Login and get JWT token
- `GET /me` - Get current user info (protected)

#### User Routes (`/api/user`) - All Protected
- `GET /locations` - Get all parking locations
- `GET /slots` - Get available parking slots
- `POST /book` - Book a parking slot
- `GET /bookings` - Get user's booking history
- `POST /pay` - Simulate payment for booking

#### Admin Routes (`/api/admin`) - All Protected
- `GET /stats` - Dashboard statistics
- `GET /users` - Get all users
- `GET /bookings` - Get all bookings for admin's slots
- `GET /slots` - Get all slots managed by admin
- `POST /slots` - Add new parking slot
- `DELETE /slots/:id` - Delete parking slot
- `PUT /users/:id/role` - Update user role

### Authentication Flow
1. User registers/logs in
2. Backend generates JWT token with user data
3. Token stored in localStorage on frontend
4. Token sent in Authorization header for protected routes
5. Middleware verifies token and attaches user to request

### Key Features Implementation

#### 1. Role-Based Access Control
- JWT payload contains user role
- Middleware checks role before allowing access
- Admin-only routes protected with role verification

#### 2. Booking System
- Check slot availability
- Calculate fees (₹50/hour)
- Create booking with start/end time
- Update slot status to 'occupied'
- Generate QR code data for booking

#### 3. Payment System
- Simulated payment flow
- Payment record created with booking
- Status: pending → completed
- Real integration ready (Stripe/Razorpay)

#### 4. Admin Features
- Auto-generate slots during registration
- Manage slots (add/delete)
- View all bookings for their locations
- Dashboard with statistics
- User role management

---

## Frontend Implementation

### Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── ProtectedRoute.jsx   # Route guard
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageSlots.jsx
│   │   │   └── ManageUsers.jsx
│   │   └── user/
│   │       ├── Dashboard.jsx
│   │       ├── Bookings.jsx
│   │       ├── ParkVehicle.jsx
│   │       ├── FindVehicle.jsx
│   │       ├── FeeCalculator.jsx
│   │       ├── Settings.jsx
│   │       └── Support.jsx
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
├── vercel.json                  # Vercel configuration
└── package.json
```

### State Management
- **AuthContext**: Global authentication state
  - User data
  - Token management
  - Login/logout functions
  - Auto-fetch user on token presence

### Routing Structure
```
/ - Home (public)
/login - Login (public)
/register - Register (public)
/user/dashboard - User Dashboard (protected)
/user/park - Park Vehicle (protected)
/user/bookings - Booking History (protected)
/user/find - Find Vehicle (protected)
/user/calculator - Fee Calculator (protected)
/user/settings - Settings (protected)
/user/support - Support (protected)
/admin/dashboard - Admin Dashboard (protected, admin only)
/admin/bookings - Manage Bookings (protected, admin only)
/admin/slots - Manage Slots (protected, admin only)
/admin/users - Manage Users (protected, admin only)
```

### Key Components

#### 1. AuthContext
- Manages authentication state globally
- Axios default configuration (baseURL, headers)
- Auto-login on page refresh if token exists
- Login/logout/register functions

#### 2. ProtectedRoute
- Wrapper for protected routes
- Checks authentication status
- Redirects to login if not authenticated
- Optional role-based access control

#### 3. Navbar
- Dynamic navigation based on user role
- Logout functionality
- Responsive design

---

## Security Implementation

### Backend Security
1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Never store plain passwords

2. **JWT Authentication**
   - Signed tokens with secret key
   - 1-day expiration
   - Payload: user id, role, name

3. **CORS Configuration**
   - Whitelist frontend URL
   - Credentials support enabled

4. **SQL Injection Prevention**
   - Parameterized queries
   - mysql2 prepared statements

5. **Environment Variables**
   - Sensitive data in .env
   - .env excluded from git

### Frontend Security
1. **Token Storage**
   - localStorage for persistence
   - Cleared on logout

2. **Protected Routes**
   - Route guards for authentication
   - Role-based access control

3. **API Security**
   - Token in Authorization header
   - Automatic token attachment via Axios

---

## Deployment Configuration

### Environment Variables

#### Backend (Render)
```
PORT=5000
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASSWORD=<railway_password>
DB_NAME=railway
JWT_SECRET=parking_jwt_secret_2024_secure_random_key
FRONTEND_URL=https://parking-management-system-lzuovey9h.vercel.app
```

#### Frontend (Vercel)
```
VITE_API_URL=https://parking-backend-zujp.onrender.com/api
```

### Deployment Files

#### vercel.json (Frontend)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### render.yaml (Backend)
```yaml
services:
  - type: web
    name: parking-backend
    env: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
```

---

## Key Features

### User Features
1. **Registration & Login**
   - Email/password authentication
   - JWT-based sessions

2. **Parking Slot Booking**
   - View available slots by location
   - Select slot type (car/bike)
   - Specify duration and vehicle number
   - Get QR code for booking

3. **Booking Management**
   - View booking history
   - See active/completed bookings
   - Payment status tracking

4. **Fee Calculator**
   - Calculate parking fees
   - Based on duration (₹50/hour)

5. **Find Vehicle**
   - Locate parked vehicle
   - View active parking details

### Admin Features
1. **Dashboard**
   - Total users count
   - Total bookings
   - Revenue statistics

2. **Slot Management**
   - Add new parking slots
   - Delete existing slots
   - View all slots with status

3. **Booking Management**
   - View all bookings
   - Filter by status
   - User details for each booking

4. **User Management**
   - View all registered users
   - Change user roles (user ↔ admin)
   - Prevent self-demotion

5. **Auto-Slot Generation**
   - During admin registration
   - Specify number of slots
   - Auto-create with sequential numbers

---

## Database Relationships

```
Users (1) ←→ (N) ParkingSlots (admin_id)
Users (1) ←→ (N) Bookings (user_id)
ParkingSlots (1) ←→ (N) Bookings (slot_id)
Bookings (1) ←→ (1) Payments (booking_id)
```

### Cascade Deletes
- Delete User → Delete their Bookings
- Delete ParkingSlot → Delete related Bookings
- Delete Booking → Delete related Payment

---

## Business Logic

### Booking Flow
1. User selects location and views available slots
2. User chooses slot, duration, enters vehicle number
3. System calculates fee (duration × ₹50)
4. Booking created with status 'active'
5. Slot status updated to 'occupied'
6. Payment record created with status 'pending'
7. QR code generated for booking verification

### Payment Flow
1. User views bookings with payment status
2. Clicks "Pay" for pending payment
3. System simulates payment (ready for real gateway)
4. Payment status updated to 'completed'
5. Booking remains active until end_time

### Admin Slot Management
1. Admin can only manage their own slots
2. Slots linked to admin via admin_id
3. Deleting slot cascades to bookings
4. Slot types: car or bike

---

## Performance Optimizations

### Backend
- MySQL connection pooling (10 connections)
- Indexed foreign keys for faster joins
- Efficient SQL queries with JOINs

### Frontend
- Vite for fast builds and HMR
- Code splitting via React Router
- Lazy loading ready
- Optimized bundle size

### Database
- Proper indexing on foreign keys
- ENUM types for status fields
- Timestamp defaults for audit trails

---

## Future Enhancements

1. **Real Payment Integration**
   - Stripe/Razorpay integration
   - Payment webhooks
   - Refund handling

2. **Real-time Updates**
   - WebSocket for slot availability
   - Live booking notifications

3. **Advanced Features**
   - Slot reservation system
   - Multi-level parking support
   - Vehicle type validation
   - Parking duration extension
   - Email/SMS notifications

4. **Analytics**
   - Revenue charts
   - Occupancy trends
   - Peak hours analysis

5. **Mobile App**
   - React Native version
   - QR code scanning

---

## Testing

### Manual Testing Checklist
- ✅ User registration
- ✅ User login
- ✅ Admin registration with auto-slots
- ✅ View available slots
- ✅ Book parking slot
- ✅ View booking history
- ✅ Simulate payment
- ✅ Admin dashboard stats
- ✅ Admin slot management
- ✅ Admin user role management

### Default Test Credentials
```
Admin:
Email: admin@admin.com
Password: admin123
```

---

## Deployment URLs

- **Frontend**: https://parking-management-system-lzuovey9h.vercel.app
- **Backend**: https://parking-backend-zujp.onrender.com
- **Database**: Railway MySQL (private)

---

## Project Statistics

- **Total Files**: 30+
- **Backend Routes**: 15
- **Frontend Pages**: 14
- **Database Tables**: 4
- **API Endpoints**: 15
- **Lines of Code**: ~2000+

---

## Development Setup

### Prerequisites
- Node.js 16+
- MySQL 8+
- Git

### Local Installation

1. **Clone Repository**
```bash
git clone https://github.com/kundansingh2005/Parking_management_system.git
cd Parking_management_system
```

2. **Backend Setup**
```bash
cd backend
npm install
# Create .env file with database credentials
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
# Create .env file with API URL
npm run dev
```

4. **Database Setup**
```bash
mysql -u root -p < init.sql
```

---

## Conclusion

This Parking Management System demonstrates a complete full-stack application with:
- Secure authentication and authorization
- Role-based access control
- RESTful API design
- Responsive React frontend
- MySQL relational database
- Cloud deployment (Vercel + Render + Railway)
- Production-ready architecture

The system is scalable, maintainable, and ready for real-world deployment with minimal modifications for payment gateway integration.
