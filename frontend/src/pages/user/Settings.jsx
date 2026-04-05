import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Settings as SettingsIcon, User, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Read actual default from DOM on mount
    const isLight = document.documentElement.classList.contains('light-theme');
    setDarkMode(!isLight);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('light-theme');
      localStorage.setItem('app-theme', 'light');
    } else {
      root.classList.remove('light-theme');
      localStorage.setItem('app-theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SettingsIcon color="var(--primary)" />
          Settings
        </h2>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <User size={20} /> Profile Details
          </h3>
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={user?.name || ''} disabled />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>
          <button className="btn btn-primary" disabled>Update Profile</button>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '30px 0' }} />

        <div>
           <h3 style={{ marginBottom: '15px' }}>Preferences</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
             <div>
                <strong style={{ display: 'block' }}>Theme Configuration</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose between light and dark mode layout.</span>
             </div>
             <button onClick={toggleTheme} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
               {darkMode ? 'Light Mode' : 'Dark Mode'}
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
