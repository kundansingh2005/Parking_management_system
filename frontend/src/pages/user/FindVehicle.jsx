import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Navigation } from 'lucide-react';

const FindVehicle = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Re-use bookings endpoint to find active parking
    axios.get('/user/bookings')
      .then(res => setBookings(res.data.filter(b => b.status === 'active')))
      .catch(err => console.error(err));
  }, []);

  const filtered = bookings.filter(b => 
    b.slot_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.vehicle_number && b.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.id.toString().includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search color="var(--primary)" />
        Find My Vehicle
      </h2>

      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <input 
            type="text" 
            placeholder="Search by Slot Number or Booking ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '15px' }}>Active Vehicles</h3>
          
          {filtered.length > 0 ? filtered.map(b => (
            <div key={b.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', marginBottom: '15px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>Slot: {b.slot_number}</h4>
                <span className="badge badge-success">#{b.id}</span>
              </div>
              <p style={{ margin: '0 0 5px 0' }}>Vehicle: <strong>{b.vehicle_number || 'N/A'}</strong></p>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                Parked at: {new Date(b.start_time).toLocaleTimeString()}
              </p>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}>
                <Navigation size={16} /> Navigate to Vehicle
              </button>
            </div>
          )) : (
            <p style={{ color: 'var(--text-muted)' }}>No active vehicles found matching your criteria.</p>
          )}
        </div>

        <div className="glass-panel" style={{ flex: '1 1 400px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '15px' }}>Navigation Map</h3>
          <div style={{ flex: 1, background: '#2a2e37', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>[ Google Maps Integration Placeholder ]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindVehicle;
