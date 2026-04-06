# Deployment Guide

## Environment Modes

This project supports two modes:

### 1. Demo Mode (Default)
Perfect for presentations and testing without backend dependencies.

**Features:**
- Mock data for locations and parking slots
- Simulated registration and login
- Fake booking confirmations
- No backend/database required

**To Enable Demo Mode:**
```env
VITE_DEMO_MODE=true
```

### 2. Production Mode
Uses real backend API and database.

**Features:**
- Real user authentication with JWT
- Database-backed parking slots
- Actual booking records
- Payment tracking

**To Enable Production Mode:**
```env
VITE_DEMO_MODE=false
```

---

## Deployment Instructions

### Frontend (Vercel)

1. **Environment Variables:**
   ```
   VITE_API_URL=https://parking-backend-zujp.onrender.com/api
   VITE_DEMO_MODE=true
   ```

2. **Deploy:**
   - Push to GitHub
   - Vercel auto-deploys
   - Or manually: `vercel --prod`

### Backend (Render)

1. **Environment Variables:**
   ```
   PORT=5000
   DB_HOST=turntable.proxy.rlwy.net
   DB_PORT=43939
   DB_USER=root
   DB_PASSWORD=<your_railway_password>
   DB_NAME=railway
   JWT_SECRET=parking_jwt_secret_2024_secure_random_key
   FRONTEND_URL=https://parking-management-system-1ndkgfhku.vercel.app
   ```

2. **Deploy:**
   - Push to GitHub
   - Render auto-deploys

### Database (Railway)

1. **Provision MySQL**
2. **Run init.sql** to create tables
3. **Copy connection details** to Render environment variables

---

## Switching Between Modes

### For Demo/Presentation:
1. Set `VITE_DEMO_MODE=true` in Vercel
2. Redeploy frontend
3. All features work without backend

### For Production:
1. Ensure backend and database are running
2. Set `VITE_DEMO_MODE=false` in Vercel
3. Redeploy frontend
4. App uses real API calls

---

## URLs

- **Frontend**: https://parking-management-system-1ndkgfhku.vercel.app
- **Backend**: https://parking-backend-zujp.onrender.com
- **GitHub**: https://github.com/kundansingh2005/Parking_management_system

---

## Testing

### Demo Mode Test:
1. Visit frontend URL
2. Register with any email/password
3. Login with same credentials
4. Book a parking slot
5. See confirmation receipt

### Production Mode Test:
1. Ensure backend is running (visit backend URL)
2. Register a real user
3. Login with real credentials
4. Book actual parking slot
5. Check database for booking record

---

## Troubleshooting

**Issue**: CORS errors
- **Solution**: Backend now allows all `.vercel.app` domains

**Issue**: Database connection failed
- **Solution**: Use Railway public host with port 43939

**Issue**: Slots not showing
- **Solution**: Check `VITE_DEMO_MODE` setting in Vercel

**Issue**: Login not working
- **Solution**: In demo mode, any credentials work. In production, use registered users.
