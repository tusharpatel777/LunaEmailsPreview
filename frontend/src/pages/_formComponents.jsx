/**
 * _formComponents.jsx
 *
 * Shared glass-morphism form sub-components reused by
 * CreateTemplate and EditTemplate to avoid duplication.
 */

/** Labelled field wrapper */
export const Field = ({ label, children, theme }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
    {label && (
      <label style={{
        fontWeight: '600',
        fontSize: '12px',
        color: theme.textSecondary,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
    )}
    {children}
  </div>
);

/** Frosted glass text input */
export const GlassInput = ({ value, onChange, placeholder, theme }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      padding: '11px 14px',
      backgroundColor: theme.bgInput,
      border: `1px solid ${theme.borderInput}`,
      borderRadius: '10px',
      fontSize: '14px',
      color: theme.textPrimary,
      outline: 'none',
      backdropFilter: theme.blur,
      WebkitBackdropFilter: theme.blur,
      width: '100%',
    }}
  />
);

/** Ghost / secondary button */
export const GhostBtn = ({ children, onClick, theme, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      padding: '10px 18px',
      backgroundColor: theme.btnGhost,
      border: `1px solid ${theme.btnGhostBorder}`,
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      color: theme.textSecondary,
      backdropFilter: theme.blur,
      WebkitBackdropFilter: theme.blur,
    }}
  >
    {children}
  </button>
);

/** Gradient primary button with glow shadow */
export const PrimaryBtn = ({ children, onClick, disabled, theme, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '10px 24px',
      background: theme.btnPrimary,
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.65 : 1,
      boxShadow: theme.shadowBtn,
    }}
  >
    {children}
  </button>
);

/** Purple tinted secondary button (for "Preview" in edit form) */
export const AccentBtn = ({ children, onClick, theme }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: '10px 18px',
      backgroundColor: theme.bgTag,
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      color: theme.textTag,
    }}
  >
    {children}
  </button>
);
