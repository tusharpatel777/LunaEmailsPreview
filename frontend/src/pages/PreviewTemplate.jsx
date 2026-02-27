import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTemplateById } from '../api/templateApi';

/**
 * PreviewTemplate Page
 *
 * Renders an email template inside an <iframe> using the srcDoc attribute.
 * Features:
 *  1. Desktop (600px) / Mobile (375px) viewport toggle
 *  2. Dynamic variable form — if the HTML contains {{name}}, {{order_id}} etc.,
 *     the user can fill in values and they are replaced before rendering.
 *  3. Live re-render on every variable input change.
 */
const PreviewTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Variable values entered by the user: { name: 'John', order_id: '123' }
  const [varValues, setVarValues] = useState({});

  // Viewport: 'desktop' = 600px wide, 'mobile' = 375px wide
  const [viewport, setViewport] = useState('desktop');

  const VIEWPORT_WIDTHS = {
    desktop: '600px',
    mobile: '375px',
  };

  // Fetch the full template (including htmlContent) by ID
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplateById(id);
        const t = data.data;
        setTemplate(t);

        // Initialize variable form with empty strings
        const initialVars = {};
        t.variables.forEach((v) => {
          initialVars[v] = '';
        });
        setVarValues(initialVars);
      } catch (err) {
        setError('Template not found or server is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id]);

  /**
   * Replace all {{variableName}} placeholders in the HTML with user-provided values.
   * Falls back to the placeholder itself if no value is entered,
   * so the user can see which variables are still unfilled.
   *
   * @param {string} html - Raw HTML string with placeholders
   * @returns {string} Processed HTML with values substituted
   */
  const resolveVariables = (html) => {
    return html.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      const value = varValues[varName];
      // Show entered value or keep placeholder visually highlighted
      return value !== undefined && value !== ''
        ? value
        : `<span style="background:#fef9c3;color:#92400e;padding:0 3px;border-radius:3px;font-weight:600;">${match}</span>`;
    });
  };

  // The processed HTML that gets injected into the iframe
  const renderedHtml = template ? resolveVariables(template.htmlContent) : '';

  const handleVarChange = (varName) => (e) => {
    setVarValues((prev) => ({ ...prev, [varName]: e.target.value }));
  };

  if (loading) return <div style={styles.center}>Loading preview...</div>;
  if (error) return <div style={{ ...styles.center, color: '#ef4444' }}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <button style={styles.backBtn} onClick={() => navigate('/')}>
            ← Back
          </button>
          <div>
            <h1 style={styles.title}>{template.name}</h1>
            <p style={styles.subject}>Subject: {template.subject}</p>
          </div>
        </div>
        <div style={styles.topRight}>
          {/* Viewport toggle buttons */}
          <div style={styles.viewportToggle}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(viewport === 'desktop' ? styles.toggleActive : {}),
              }}
              onClick={() => setViewport('desktop')}
              title="Desktop view (600px)"
            >
              🖥 Desktop
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                ...(viewport === 'mobile' ? styles.toggleActive : {}),
              }}
              onClick={() => setViewport('mobile')}
              title="Mobile view (375px)"
            >
              📱 Mobile
            </button>
          </div>
          <button
            style={styles.editBtn}
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div style={styles.body}>
        {/* ── Variable Input Panel ─────────────────────────── */}
        {template.variables.length > 0 && (
          <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Template Variables</h3>
            <p style={styles.sidebarHint}>
              Fill in values to see a live preview with real data.
            </p>
            <div style={styles.varList}>
              {template.variables.map((varName) => (
                <div key={varName} style={styles.varField}>
                  <label style={styles.varLabel}>
                    <code style={styles.varCode}>{`{{${varName}}}`}</code>
                  </label>
                  <input
                    type="text"
                    value={varValues[varName] || ''}
                    onChange={handleVarChange(varName)}
                    placeholder={`Enter ${varName}...`}
                    style={styles.varInput}
                  />
                </div>
              ))}
            </div>
            <button
              style={styles.clearBtn}
              onClick={() => {
                const cleared = {};
                template.variables.forEach((v) => (cleared[v] = ''));
                setVarValues(cleared);
              }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── iframe Preview Area ──────────────────────────── */}
        <div style={styles.previewArea}>
          <div style={styles.previewHeader}>
            <span style={styles.previewLabel}>
              Preview — {viewport === 'desktop' ? 'Desktop' : 'Mobile'} (
              {VIEWPORT_WIDTHS[viewport]})
            </span>
          </div>

          {/* Centering wrapper so the iframe is centred regardless of viewport */}
          <div style={styles.iframeWrapper}>
            <iframe
              srcDoc={renderedHtml}
              title="Email Preview"
              style={{
                ...styles.iframe,
                width: VIEWPORT_WIDTHS[viewport],
              }}
              sandbox="allow-same-origin"  // Prevents script execution for security
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
  },

  /* ── Top Bar ── */
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '12px',
  },
  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '7px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
  },
  subject: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
  viewportToggle: {
    display: 'flex',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  toggleBtn: {
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#fff',
    color: '#6b7280',
  },
  toggleActive: {
    backgroundColor: '#4f46e5',
    color: '#fff',
  },
  editBtn: {
    padding: '8px 18px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  /* ── Body Layout ── */
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  /* ── Sidebar (variables) ── */
  sidebar: {
    width: '280px',
    minWidth: '260px',
    backgroundColor: '#fff',
    borderRight: '1px solid #e5e7eb',
    padding: '24px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sidebarTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#111827',
  },
  sidebarHint: {
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  varList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1,
  },
  varField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  varLabel: {
    fontSize: '12px',
    color: '#374151',
    fontWeight: '600',
  },
  varCode: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    padding: '1px 6px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  varInput: {
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '13px',
    outline: 'none',
    color: '#111827',
    backgroundColor: '#fafafa',
  },
  clearBtn: {
    padding: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#6b7280',
    cursor: 'pointer',
    marginTop: '4px',
  },

  /* ── Preview Area ── */
  previewArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  previewHeader: {
    padding: '10px 20px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  previewLabel: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  iframeWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 20px',
    backgroundColor: '#e5e7eb',
    overflowY: 'auto',
  },
  iframe: {
    height: '100%',
    minHeight: '600px',
    border: 'none',
    borderRadius: '4px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    backgroundColor: '#fff',
    display: 'block',
    transition: 'width 0.3s ease',
  },

  /* ── Utility ── */
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '16px',
    color: '#6b7280',
  },
};

export default PreviewTemplate;
