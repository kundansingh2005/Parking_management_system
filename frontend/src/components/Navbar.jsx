import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CarFront, LayoutDashboard, Settings, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContent}>
        <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard') : '/'} style={styles.logo}>
          <CarFront size={28} className="gradient-text" />
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.2rem' }}>ParkEasy</span>
        </Link>
        
        <div style={styles.links}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)' }}>Hello, {user.name}</span>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} className="btn btn-secondary" style={styles.navBtn}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user.role === 'user' && (
                <>
                  <Link to="/user/settings" className="btn btn-secondary" style={styles.navBtn}>
                    <Settings size={18} />
                  </Link>
                  <Link to="/user/support" className="btn btn-secondary" style={styles.navBtn}>
                    <HelpCircle size={18} />
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="btn btn-danger" style={styles.navBtn}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={styles.navBtn}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={styles.navBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(24, 27, 33, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navBtn: {
    padding: '8px 16px',
    minWidth: 'auto',
  }
};

export default Navbar;
