import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates, deleteTemplate } from '../api/templateApi';
import { useTheme } from '../context/ThemeContext';

/**
 * TemplateList — glassmorphism card grid of all email templates.
 * Actions: View (preview), Edit, Delete (soft).
 */
const TemplateList = () => {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchTemplates(); }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getAllTemplates();
      setTemplates(data.data);
    } catch {
      setError('Failed to load templates. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: `3px solid ${theme.border}`,
          borderTopColor: theme.accent,
          animation: 'spinBorder 0.8s linear infinite',
        }} />
        <p style={{ color: theme.textMuted, fontSize: '14px' }}>Loading templates...</p>
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{
          padding: '20px 28px', borderRadius: '14px',
          backgroundColor: theme.error, border: `1px solid ${theme.errorBorder}`,
          color: theme.errorText, fontSize: '14px',
          backdropFilter: theme.blur, WebkitBackdropFilter: theme.blur,
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}
         className="fade-slide-up">

      {/* ── Page Header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Email Templates
          </h1>
          <p style={{ fontSize: '14px', color: theme.textMuted }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: theme.bgGlass, border: `1px solid ${theme.border}`,
              padding: '3px 10px', borderRadius: '100px', fontSize: '12px',
              color: theme.textSecondary,
              backdropFilter: theme.blur, WebkitBackdropFilter: theme.blur,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: theme.accentCyan, display: 'inline-block' }} />
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </span>
          </p>
        </div>

        <GlowButton onClick={() => navigate('/create')} theme={theme}>
          + New Template
        </GlowButton>
      </div>

      {/* ── Empty State ───────────────────────────────────────── */}
      {templates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '22px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
            boxShadow: `0 0 40px ${theme.accentGlow}`,
          }}>
            ✉
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '700', color: theme.textPrimary, marginBottom: '10px' }}>
            No templates yet
          </h3>
          <p style={{ color: theme.textMuted, marginBottom: '28px', fontSize: '15px' }}>
            Create your first email template to get started.
          </p>
          <GlowButton onClick={() => navigate('/create')} theme={theme}>
            Create Template
          </GlowButton>
        </div>
      )}

      {/* ── Card Grid ────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: '20px',
      }}>
        {templates.map((template, i) => (
          <div
            key={template._id}
            className="glass card-hover"
            style={{
              backgroundColor: theme.bgGlass,
              backdropFilter: theme.blur,
              WebkitBackdropFilter: theme.blur,
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadowCard,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: `fadeSlideUp 0.4s ease ${i * 0.05}s both`,
            }}
          >
            {/* Card body */}
            <div style={{ padding: '22px 22px 16px' }}>
              {/* Accent top line */}
              <div style={{
                width: '36px', height: '3px', borderRadius: '2px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                marginBottom: '14px',
              }} />

              <h2 style={{ fontSize: '17px', fontWeight: '700', color: theme.textPrimary, marginBottom: '8px', lineHeight: '1.3' }}>
                {template.name}
              </h2>
              <p style={{ fontSize: '13px', color: theme.textMuted, marginBottom: '14px', lineHeight: '1.5' }}>
                <span style={{ color: theme.textSecondary, fontWeight: '600' }}>Subject: </span>
                {template.subject}
              </p>

              {/* Variable badges */}
              {template.variables.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {template.variables.map((v) => (
                    <span key={v} style={{
                      backgroundColor: theme.bgTag,
                      color: theme.textTag,
                      border: `1px solid ${theme.border}`,
                      fontSize: '11px',
                      padding: '3px 9px',
                      borderRadius: '100px',
                      fontFamily: 'monospace',
                      fontWeight: '600',
                    }}>
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Card footer */}
            <div style={{
              padding: '12px 22px',
              backgroundColor: theme.bgFooter,
              borderTop: `1px solid ${theme.borderFooter}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
            }}>
              <span style={{ fontSize: '11px', color: theme.textMuted }}>
                {formatDate(template.createdAt)}
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                {/* View */}
                <ActionBtn
                  bg={theme.btnView} color={theme.btnViewText}
                  onClick={() => navigate(`/preview/${template._id}`)}
                  title="Preview"
                >
                  View
                </ActionBtn>
                {/* Edit */}
                <ActionBtn
                  bg={theme.btnEdit} color={theme.btnEditText}
                  onClick={() => navigate(`/edit/${template._id}`)}
                  title="Edit"
                >
                  Edit
                </ActionBtn>
                {/* Delete */}
                <ActionBtn
                  bg={theme.btnDelete} color={theme.btnDeleteText}
                  onClick={() => handleDelete(template._id, template.name)}
                  disabled={deletingId === template._id}
                  title="Delete"
                >
                  {deletingId === template._id ? '...' : 'Delete'}
                </ActionBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────────── */

const GlowButton = ({ children, onClick, theme }) => (
  <button
    onClick={onClick}
    style={{
      padding: '11px 22px',
      background: theme.btnPrimary,
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: theme.shadowBtn,
      letterSpacing: '0.01em',
    }}
  >
    {children}
  </button>
);

const ActionBtn = ({ children, onClick, bg, color, disabled, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      padding: '5px 12px',
      borderRadius: '7px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      backgroundColor: bg,
      color,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

export default TemplateList;
