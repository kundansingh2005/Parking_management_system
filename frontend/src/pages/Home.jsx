import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }} className="gradient-text">
        Welcome to ParkEasy
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px' }}>
        The next-generation Parking Management System. Find spots easily, pay seamlessly, and track everything in one dashboard.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '60px' }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
          Get Started Now
        </Link>
      </div>

      <div className="grid-cards">
        <div className="glass-panel">
          <Zap size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '10px' }}>Lightning Fast</h3>
          <p style={{ color: 'var(--text-muted)' }}>Book your spot in seconds without waiting in lines.</p>
        </div>
        <div className="glass-panel">
          <Car size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '10px' }}>Guaranteed Spot</h3>
          <p style={{ color: 'var(--text-muted)' }}>Real-time availability so you always know where to park.</p>
        </div>
        <div className="glass-panel">
          <ShieldCheck size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '10px' }}>Secure Payments</h3>
          <p style={{ color: 'var(--text-muted)' }}>Your transactions and parking history are safely stored.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
