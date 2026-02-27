import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar — glass morphism top navigation with light/dark toggle.
 * Uses backdrop-filter for the frosted-glass effect.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const { theme, isDark, toggle } = useTheme();

  const isActive = (path) => pathname === path;

  return (
    <nav
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: theme.bgGlassStrong,
        backdropFilter: theme.blurNav,
        WebkitBackdropFilter: theme.blurNav,
        borderBottom: `1px solid ${theme.border}`,
        boxShadow: theme.shadowNav,
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── Brand ─────────────────────────────────── */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}>
          {/* Glowing icon */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: `0 0 16px ${theme.accentGlow}`,
            flexShrink: 0,
          }}>
            ✉
          </div>
          <span className="gradient-text" style={{
            fontSize: '17px',
            fontWeight: '800',
            letterSpacing: '-0.3px',
          }}>
            LunaEmailPreview
          </span>
        </Link>

        {/* ── Nav Links + Toggle ─────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

          <Link to="/" style={{
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: isActive('/') ? '700' : '500',
            color: isActive('/') ? theme.accent : theme.textSecondary,
            textDecoration: 'none',
            backgroundColor: isActive('/') ? theme.bgGlass : 'transparent',
            border: `1px solid ${isActive('/') ? theme.borderAccent : 'transparent'}`,
            boxShadow: isActive('/') ? theme.shadowGlow : 'none',
          }}>
            Templates
          </Link>

          <Link to="/create" style={{
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: isActive('/create') ? '700' : '500',
            color: isActive('/create') ? theme.accent : theme.textSecondary,
            textDecoration: 'none',
            backgroundColor: isActive('/create') ? theme.bgGlass : 'transparent',
            border: `1px solid ${isActive('/create') ? theme.borderAccent : 'transparent'}`,
            boxShadow: isActive('/create') ? theme.shadowGlow : 'none',
          }}>
            + New Template
          </Link>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: theme.border,
            margin: '0 6px',
          }} />

          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bgGlass,
              backdropFilter: theme.blur,
              WebkitBackdropFilter: theme.blur,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: theme.shadowCard,
              flexShrink: 0,
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
