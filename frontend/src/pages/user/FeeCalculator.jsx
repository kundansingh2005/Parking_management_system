import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const FeeCalculator = () => {
  const [duration, setDuration] = useState(1);
  const [vehicleType, setVehicleType] = useState('car');

  const rates = {
    car: 50,
    bike: 20
  };

  const getEstimatedFee = () => {
    return duration * rates[vehicleType];
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calculator color="var(--primary)" />
          Fee Calculator
        </h2>

        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Estimate your parking costs before you book.
        </p>

        <div className="input-group">
          <label>Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option value="car">Car (₹50 / hr)</option>
            <option value="bike">Bike (₹20 / hr)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Estimated Duration (Hours)</label>
          <input 
            type="number" 
            min="1" 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))} 
          />
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '24px', 
          background: 'rgba(74, 222, 128, 0.1)', 
          borderRadius: '12px', 
          textAlign: 'center',
          border: '1px solid rgba(74, 222, 128, 0.3)'
        }}>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 10px 0' }}>Estimated Total</p>
          <h1 style={{ color: 'var(--primary)', margin: 0, fontSize: '3rem' }}>
            ₹{getEstimatedFee()}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default FeeCalculator;
