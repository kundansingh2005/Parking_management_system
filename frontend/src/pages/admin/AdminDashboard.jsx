import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CarFront, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_bookings: 0, total_revenue: 0 });

  useEffect(() => {
    axios.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Admin Dashboard</h2>
      
      <div className="grid-cards">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Users size={32} color="var(--secondary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.total_users}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Registered Users</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <FileText size={32} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{stats.total_bookings}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Bookings</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <CarFront size={32} color="var(--warning)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>₹{stats.total_revenue}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Revenue</p>
          </div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ marginTop: '30px' }}>
        <h3>Quick Links</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <a href="/admin/slots" className="btn btn-primary">Manage Parking Slots</a>
          <a href="/admin/bookings" className="btn btn-secondary">View All Bookings</a>
          <a href="/admin/users" className="btn btn-secondary">Manage Users</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
