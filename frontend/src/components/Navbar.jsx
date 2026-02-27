import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component
 *
 * Persistent top navigation bar shown on every page.
 * Highlights the active route using useLocation.
 */
const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Brand */}
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>✉</span>
          LunaEmailPreview
        </Link>

        {/* Nav links */}
        <div style={styles.links}>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(pathname === '/' ? styles.linkActive : {}),
            }}
          >
            Templates
          </Link>
          <Link
            to="/create"
            style={{
              ...styles.link,
              ...(pathname === '/create' ? styles.linkActive : {}),
            }}
          >
            + New Template
          </Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '18px',
    fontWeight: '700',
    color: '#4f46e5',
    textDecoration: 'none',
  },
  brandIcon: {
    fontSize: '20px',
  },
  links: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  link: {
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  linkActive: {
    backgroundColor: '#ede9fe',
    color: '#4f46e5',
    fontWeight: '600',
  },
};

export default Navbar;
