# Multi-Tenant Parking Management System

A full-stack web platform designed to facilitate a decentralized Network of Parking Lots. This software allows multiple Parking Owners to dynamically register, define, and manage their own isolated parking hubs, while allowing Users to seamlessly search across locations, book slots, and generate downloadable receipts.

## Key Features
- **Multi-Tenant Architecture**: Supports infinite Parking Hubs managed by isolated Admin Owners.
- **Dynamic Registration**: Onboarding includes a Role Selector (User vs Parking Owner). Owner registration instantly generates parking slots in the backend attached to their Company Location.
- **User Panel**: Select a Parking Hub, book available slots, add vehicle number tracking, fee calculation, and history logs.
- **Printable Receipts**: Ditch the physical QR system for a clean, browser-native generated PDF HTML Parking Receipt.
- **Admin Panel**: Manage user roles (Promote/Demote), check location-specific live slots, scale slots capacity, and view strictly scoped revenue metrics.
- **Global Theme Engine**: Complete Light/Dark mode UI configurations permanently synced to local storage.

## Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Premium styling), Axios, React-Router-DOM, Context API.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (accessed via `mysql2`).
- **Security**: JWT (JSON Web Tokens), `bcrypt` password hashing, robust backend Middleware isolation tracking `admin_id`.

---

## Step-by-Step Installation Guide

### 1. Database Setup
Ensure you have a local MySQL server instance actively running (default port `3306`).
To initialize the schema and required tables:
1. Open your terminal at the root of the project.
2. Run the deployment script:
```bash
mysql -u root -p < init.sql
```
*(When prompted, enter your MySQL password, e.g., `kund@2005` or whatever your active machine uses).*

> **Note to Developers**: This script ensures that `admin_id` mapping and `locations` strings exist natively inside your tables to support the isolated multi-tenant data fetching.

### 2. Backend Server Setup
Open a new terminal window at the project root.
```bash
cd backend
npm install
npm run dev
```
*(The backend relies on the hidden `.env` file containing your secret keys and database links. The server will start securely on `http://localhost:5000`).*

### 3. Frontend Web Application Setup
Open a final terminal window at the project root.
```bash
cd frontend
npm install
npm run dev
```
*(The React compiler will start. Your web app will become immediately accessibly on `http://localhost:5173`).*

---

## How To Start Testing The Flow
Once the system is live on `localhost:5173`, follow these steps:
1. **Create an Admin:** Click **Register**, select the **"Parking Owner"** radio button. Fill in your name, email, Company Location (e.g., *Eastside Garage*), and initial slot capacity.
2. **Create a User:** Log out of the Admin. Register a secondary tester account as a **"Simple User"**.
3. **Execution:** Inside the User Dashboard, click Book Slot, select *Eastside Garage* from the dropdown, attach your Vehicle Number, confirm, and interact with the **Download Receipt** interface!

---

## REST API Mapping (http://localhost:5000/api)

### Authentication `/auth/*`
- `POST /register` - Dynamic payload switching on `role` tracking `location` and `total_slots`.
- `POST /login` - Binds `Token` and `role` state logic.

### User Workflows `/user/*` 
- `GET /locations` - Fetches distinct Admin Companies.
- `GET /slots?admin_id=X` - Fetches available slots scoped to the user's selected Hub.
- `POST /book` - Registers Vehicle Number to the Slot ID.

### Admin Workflows `/admin/*` -(Protected Token Routing)
- `GET /stats` - Scopes analytics strictly by `req.user.id`.
- `GET /slots` - Scopes slot inventory strictly by `req.user.id`.
- `PUT /users/:id/role` - Allows Master Admins to promote standard staff members securely. 
