import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import ParkVehicle from './pages/user/ParkVehicle';
import Bookings from './pages/user/Bookings';
import FindVehicle from './pages/user/FindVehicle';
import FeeCalculator from './pages/user/FeeCalculator';
import Settings from './pages/user/Settings';
import Support from './pages/user/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSlots from './pages/admin/ManageSlots';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  useEffect(() => {
    // Check if the user previously explicitly chose light theme
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="page-wrapper container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/park" element={<ParkVehicle />} />
            <Route path="/user/bookings" element={<Bookings />} />
            <Route path="/user/find" element={<FindVehicle />} />
            <Route path="/user/calculator" element={<FeeCalculator />} />
            <Route path="/user/settings" element={<Settings />} />
            <Route path="/user/support" element={<Support />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/slots" element={<ManageSlots />} />
            <Route path="/admin/bookings" element={<ManageBookings />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
