import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, CreditCard } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    if (isDemoMode) {
      // Demo mode - load from localStorage
      const savedBookings = localStorage.getItem('demo_bookings');
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        // Show sample bookings for demo
        setBookings([
          {
            id: 1001,
            slot_number: 'P-5',
            vehicle_number: 'DL-01-AB-1234',
            type: 'car',
            start_time: new Date().toISOString(),
            status: 'active',
            amount: 150,
            payment_status: 'completed'
          },
          {
            id: 1002,
            slot_number: 'P-8',
            vehicle_number: 'DL-02-CD-5678',
            type: 'car',
            start_time: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
            amount: 100,
            payment_status: 'completed'
          }
        ]);
      }
    } else {
      // Production mode - fetch from API
      try {
        const res = await axios.get('/user/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePayment = async (bookingId) => {
    if (isDemoMode) {
      // Demo mode - update localStorage
      const updatedBookings = bookings.map(b => 
        b.id === bookingId ? { ...b, payment_status: 'completed' } : b
      );
      setBookings(updatedBookings);
      localStorage.setItem('demo_bookings', JSON.stringify(updatedBookings));
      alert('Payment Simulated Successfully');
    } else {
      // Production mode - call API
      try {
        await axios.post('/user/pay', { booking_id: bookingId });
        alert('Payment Simulated Successfully');
        fetchBookings();
      } catch (err) {
        alert('Payment Failed');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <History color="var(--primary)" />
        My Bookings
      </h2>

      <div className="glass-panel">
        {bookings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Slot</th>
                  <th>Vehicle No</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>#{b.id}</td>
                    <td>{b.slot_number}</td>
                    <td><strong style={{ color: 'var(--text-main)' }}>{b.vehicle_number || 'N/A'}</strong></td>
                    <td>{b.type}</td>
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
                    <td>
                      {b.payment_status === 'pending' && (
                        <button onClick={() => handlePayment(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                          <CreditCard size={14} /> Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No history found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
