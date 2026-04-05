import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Car, Clock, CreditCard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
  const [stats, setStats] = useState({ active: 0, total: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/user/bookings');
      const bookings = res.data;
      setRecentBookings(bookings.slice(0, 5));
      setStats({
        active: bookings.filter(b => b.status === 'active').length,
        total: bookings.length
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Welcome, {user.name}</h2>
      
      <div className="grid-cards" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Clock size={32} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.active}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Active Bookings</p>
          </div>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Car size={32} color="var(--secondary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.total}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Parkings</p>
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link to="/user/park" className="btn btn-primary">Book New Slot</Link>
            <Link to="/user/bookings" className="btn btn-secondary">View History</Link>
            <Link to="/user/find" className="btn btn-secondary">Find Vehicle</Link>
            <Link to="/user/calculator" className="btn btn-secondary">Fee Calculator</Link>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '20px' }}>Recent Bookings</h3>
        {recentBookings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.slot_number} ({b.type})</td>
                    <td>{new Date(b.start_time).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${b.status === 'active' ? 'success' : 'neutral'}`}>{b.status}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${b.payment_status === 'completed' ? 'success' : 'warning'}`}>{b.payment_status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
