import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [location, setLocation] = useState('');
  const [totalSlots, setTotalSlots] = useState(10);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
    
    if (isDemoMode) {
      // Demo mode - always succeed
      alert('Registration successful! You can now login.');
      navigate('/login');
    } else {
      // Production mode - call real API
      try {
        await axios.post('/auth/register', { 
           name, email, password, role, 
           location: role === 'admin' ? location : undefined,
           total_slots: role === 'admin' ? totalSlots : undefined
        });
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <UserPlus size={40} className="gradient-text" style={{ margin: '0 auto' }} />
          <h2 style={{ marginTop: '10px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join ParkEasy today</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" />
          </div>
          <div className="input-group">
            <label>Register As</label>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input type="radio" value="user" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} /> Simple User
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)', cursor: 'pointer' }}>
                <input type="radio" value="admin" checked={role === 'admin'} onChange={(e) => setRole(e.target.value)} /> Parking Owner
              </label>
            </div>
          </div>

          {role === 'admin' && (
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '20px' }}>
              <div className="input-group">
                <label>Company / Display Location</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Central Mall Undergound" />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Initial Parking Slots Capacity</label>
                <input type="number" min="1" max="500" required value={totalSlots} onChange={(e) => setTotalSlots(parseInt(e.target.value))} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
