import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare } from 'lucide-react';

const Support = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support ticket submitted successfully. We will contact you soon.');
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HelpCircle color="var(--primary)" />
        Support Center
      </h2>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: '1 1 300px' }}>
          <h3 style={{ marginBottom: '20px' }}>Contact Information</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '12px', borderRadius: '50%' }}>
              <Phone size={24} color="var(--primary)" />
            </div>
            <div>
              <strong style={{ display: 'block' }}>Helpline Number</strong>
              <span style={{ color: 'var(--text-muted)' }}>+1 (800) 123-4567</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
              <Mail size={24} color="var(--secondary)" />
            </div>
            <div>
              <strong style={{ display: 'block' }}>Email Support</strong>
              <span style={{ color: 'var(--text-muted)' }}>support@parkeasy.com</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '50%' }}>
              <MessageSquare size={24} color="var(--warning)" />
            </div>
            <div>
              <strong style={{ display: 'block' }}>Live Chat</strong>
              <span style={{ color: 'var(--text-muted)' }}>Available 24/7 on website</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '15px' }}>Submit a Ticket</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Subject</label>
              <input type="text" required placeholder="Brief description of the issue" />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea 
                required 
                rows="5" 
                placeholder="Please describe your problem in detail..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical' }}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
