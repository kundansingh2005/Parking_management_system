import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Download } from 'lucide-react';

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

  useEffect(() => {
    // Fetch locations
    axios.get('/user/locations')
      .then(res => setLocations(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Fetch slots when location is selected
    if (selectedLocation) {
      axios.get(`/user/slots?admin_id=${selectedLocation}`)
        .then(res => setSlots(res.data))
        .catch(err => console.error(err));
    } else {
      setSlots([]);
    }
    setSelectedSlot(''); // Reset selected slot when location changes
  }, [selectedLocation]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/book', { slot_id: selectedSlot, duration_hours: duration, vehicle_number: vehicleNumber });
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
        {/* Simple map placeholder */}
        <div className="glass-panel" style={{ flex: '1 1 400px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '15px' }}>Location Map</h3>
          <div style={{ flex: 1, background: '#2a2e37', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>[ Google Maps Integration Placeholder ]</p>
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
                <label>Select Available Slot</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                  gap: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px'
                }}>
                  {slots.map(slot => (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      style={{
                        padding: '15px 10px',
                        background: selectedSlot === slot.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        border: selectedSlot === slot.id ? '2px solid var(--primary)' : '2px solid transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSlot !== slot.id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSlot !== slot.id) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                        {slot.slot_number}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase'
                      }}>
                        {slot.type}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        marginTop: '5px',
                        padding: '2px 6px',
                        background: 'rgba(74, 222, 128, 0.2)',
                        color: '#4ade80',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        Available
                      </div>
                    </div>
                  ))}
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
