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

            {selectedLocation && (
              <div className="input-group">
                <label>Select Available Slot</label>
                <select required value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                  <option value="">-- Choose Slot --</option>
                  {slots.map(s => (
                    <option key={s.id} value={s.id}>{s.slot_number} ({s.type})</option>
                  ))}
                </select>
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
