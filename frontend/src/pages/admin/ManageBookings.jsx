import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/admin/bookings');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Manage Bookings</h2>

      <div className="glass-panel">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Vehicle No</th>
                <th>Slot</th>
                <th>Start Date</th>
                <th>Booking Status</th>
                <th>Amount</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <div>{b.user_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.email}</div>
                  </td>
                  <td><strong style={{ color: 'var(--text-main)' }}>{b.vehicle_number || 'N/A'}</strong></td>
                  <td>{b.slot_number}</td>
                  <td>{new Date(b.start_time).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${b.status === 'active' ? 'success' : 'neutral'}`}>{b.status}</span>
                  </td>
                  <td>₹{b.amount || 0}</td>
                  <td>
                    <span className={`badge badge-${b.payment_status === 'completed' ? 'success' : 'warning'}`}>
                      {b.payment_status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No bookings found.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
