import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Download } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ParkVehicle = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [fee, setFee] = useState(0);
  const [qrData, setQrData] = useState('');
  const navigate = useNavigate();

  // Check if demo mode is enabled
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Map configuration
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '8px'
  };

  const defaultCenter = {
    lat: 28.6139, // Delhi coordinates
    lng: 77.2090
  };

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Location coordinates for demo locations
  const locationCoordinates = {
    1: { lat: 28.6139, lng: 77.2090, name: 'Central Mall Underground' },
    2: { lat: 28.5355, lng: 77.3910, name: 'City Plaza Parking' },
    3: { lat: 28.5562, lng: 77.1000, name: 'Airport Terminal 1' }
  };

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - use mock data
      setLocations([
        { admin_id: 1, location: 'Central Mall Underground', company_name: 'Central Parking' },
        { admin_id: 2, location: 'City Plaza Parking', company_name: 'City Parking Services' },
        { admin_id: 3, location: 'Airport Terminal 1', company_name: 'Airport Parking' }
      ]);
    } else {
      // Production mode - fetch from API
      axios.get('/user/locations')
        .then(res => setLocations(res.data))
        .catch(err => console.error(err));
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (selectedLocation) {
      // Update map center when location is selected
      const coords = locationCoordinates[selectedLocation];
      if (coords) {
        setMapCenter({ lat: coords.lat, lng: coords.lng });
      }

      if (isDemoMode) {
        // Demo mode - use mock slots
        const demoSlots = [];
        for (let i = 1; i <= 12; i++) {
          demoSlots.push({
            id: i,
            slot_number: `P-${i}`,
            type: i % 3 === 0 ? 'bike' : 'car',
            status: 'available'
          });
        }
        setSlots(demoSlots);
      } else {
        // Production mode - fetch from API
        axios.get(`/user/slots?admin_id=${selectedLocation}`)
          .then(res => setSlots(res.data))
          .catch(err => console.error(err));
      }
    } else {
      setSlots([]);
    }
    setSelectedSlot('');
  }, [selectedLocation, isDemoMode]);

  const handleBook = async (e) => {
    e.preventDefault();
    
    if (isDemoMode) {
      // Demo mode - always show success
      const selectedSlotData = slots.find(s => s.id === parseInt(selectedSlot));
      const locationData = locations.find(l => l.admin_id === parseInt(selectedLocation));
      
      setReceiptData({
        id: Math.floor(Math.random() * 10000),
        locationName: locationData?.location || 'N/A',
        vehicle: vehicleNumber,
        duration: duration,
        slotNumber: selectedSlotData?.slot_number || 'N/A'
      });
      setSuccess(true);
      setQrData(`booking_${Date.now()}`);
      setFee(duration * 50);
    } else {
      // Production mode - call real API
      try {
        const res = await axios.post('/user/book', { 
          slot_id: selectedSlot, 
          duration_hours: duration, 
          vehicle_number: vehicleNumber 
        });
        const selectedSlotData = slots.find(s => s.id === parseInt(selectedSlot));
        const locationData = locations.find(l => l.admin_id === parseInt(selectedLocation));
        
        setReceiptData({
          id: res.data.bookingId,
          locationName: locationData?.location || 'N/A',
          vehicle: vehicleNumber,
          duration: duration,
          slotNumber: selectedSlotData?.slot_number || 'N/A'
        });
        setSuccess(true);
        setQrData(`booking_${res.data.bookingId}`);
        setFee(res.data.amount);
      } catch (err) {
        alert(err.response?.data?.message || 'Booking failed');
      }
    }
  };

  if (success) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
          <CheckCircle size={60} color="var(--success)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ marginBottom: '10px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Your parking spot is successfully booked.</p>
          
          <div id="receipt-area" style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '8px', textAlign: 'left', marginBottom: '20px' }}>
             <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px', textAlign: 'center' }}>PARKING RECEIPT</h3>
             <p><strong>Booking ID:</strong> #{receiptData?.id}</p>
             <p><strong>Location:</strong> {receiptData?.locationName}</p>
             <p><strong>Vehicle No:</strong> {receiptData?.vehicle}</p>
             <p><strong>Duration:</strong> {receiptData?.duration} Hour(s)</p>
             <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px', marginTop: '10px', textAlign: 'right' }}>
                <p style={{ margin: 0 }}><strong>Total Fee:</strong> ₹{fee}</p>
             </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
             <button onClick={() => window.print()} className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '5px' }}>
               <Download size={18} /> Download Receipt
             </button>
             <button onClick={() => navigate('/user/bookings')} className="btn btn-primary" style={{ flex: 1 }}>
               View My Bookings
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MapPin color="var(--primary)" />
        Park Vehicle
      </h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Google Maps */}
        <div className="glass-panel" style={{ flex: '1 1 400px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '15px' }}>Location Map</h3>
          <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
            {googleMapsApiKey ? (
              <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                >
                  {selectedLocation && locationCoordinates[selectedLocation] && (
                    <Marker 
                      position={{ 
                        lat: locationCoordinates[selectedLocation].lat, 
                        lng: locationCoordinates[selectedLocation].lng 
                      }}
                      title={locationCoordinates[selectedLocation].name}
                    />
                  )}
                </GoogleMap>
              </LoadScript>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: '#2a2e37', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-muted)',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <MapPin size={40} color="var(--primary)" />
                <p>Google Maps API key not configured</p>
                <p style={{ fontSize: '12px' }}>Add VITE_GOOGLE_MAPS_API_KEY to environment variables</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '15px' }}>Booking Details</h3>
          <form onSubmit={handleBook}>
            <div className="input-group">
              <label>Select Parking Location</label>
              <select required value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">-- Choose Parking Hub --</option>
                {locations.map(l => (
                  <option key={l.admin_id} value={l.admin_id}>{l.location} (Operated by {l.company_name})</option>
                ))}
              </select>
            </div>

            {selectedLocation && slots.length > 0 && (
              <div className="input-group">
                <label>Available Parking Slots</label>
                <div style={{ 
                  overflowX: 'auto',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  padding: '10px'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '12px' }}>SLOT NO</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '12px' }}>TYPE</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '12px' }}>STATUS</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map(slot => (
                        <tr 
                          key={slot.id}
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: selectedSlot === slot.id ? 'rgba(74, 222, 128, 0.1)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '12px', color: 'var(--text-main)' }}>{slot.slot_number}</td>
                          <td style={{ padding: '12px', color: 'var(--text-main)', textTransform: 'capitalize' }}>{slot.type}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '4px 12px',
                              background: 'rgba(74, 222, 128, 0.2)',
                              color: '#4ade80',
                              borderRadius: '12px',
                              fontSize: '12px',
                              textTransform: 'uppercase'
                            }}>
                              Available
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedSlot(slot.id)}
                              style={{
                                padding: '6px 16px',
                                background: selectedSlot === slot.id ? 'var(--primary)' : 'rgba(74, 222, 128, 0.2)',
                                color: selectedSlot === slot.id ? '#fff' : '#4ade80',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500'
                              }}
                            >
                              {selectedSlot === slot.id ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedLocation && slots.length === 0 && (
              <div style={{ 
                padding: '20px', 
                textAlign: 'center', 
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                No available slots at this location
              </div>
            )}
            
            <div className="input-group">
              <label>Vehicle Number (e.g., AB-01-CD-1234)</label>
              <input type="text" required placeholder="Enter Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Duration (Hours)</label>
              <input type="number" min="1" max="24" required value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px', color: 'var(--primary)', fontWeight: 'bold' }}>
              Estimated Fee: ₹{duration * 50}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!selectedSlot}>
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ParkVehicle;
