import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const ManageSlots = () => {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [slotType, setSlotType] = useState('car');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get('/admin/slots');
      setSlots(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/slots', { slot_number: slotNumber, type: slotType });
      setSlotNumber('');
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding slot');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await axios.delete(`/admin/slots/${id}`);
        fetchSlots();
      } catch (err) {
        alert('Error deleting slot');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px' }}>Manage Parking Slots</h2>
      
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Add New Slot</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Slot Number (e.g. A4)</label>
            <input type="text" required value={slotNumber} onChange={e => setSlotNumber(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Type</label>
            <select value={slotType} onChange={e => setSlotType(e.target.value)}>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>Add Slot</button>
        </form>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '20px' }}>Current Slots</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Slot No</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.slot_number}</td>
                  <td>{s.type}</td>
                  <td>
                    <span className={`badge badge-${s.status === 'available' ? 'success' : (s.status === 'occupied' ? 'warning' : 'error')}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-danger" style={{ padding: '6px 12px' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;
