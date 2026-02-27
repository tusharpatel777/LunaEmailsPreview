import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTemplateById } from '../api/templateApi';
import { useTheme } from '../context/ThemeContext';

/**
 * PreviewTemplate — renders an email template inside an iframe.
 *
 * Features:
 *  1. Viewport toggle: Desktop (600px) / Mobile (375px)
 *  2. Glass sidebar: live variable inputs that replace {{placeholders}}
 *  3. iframe uses srcDoc + sandbox for secure, isolated rendering
 */
const PreviewTemplate = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [varValues, setVarValues] = useState({});
  const [viewport, setViewport]   = useState('desktop');

  const VIEWPORT_WIDTHS = { desktop: '600px', mobile: '375px' };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTemplateById(id);
        const t = data.data;
        setTemplate(t);
        const init = {};
        t.variables.forEach((v) => { init[v] = ''; });
        setVarValues(init);
      } catch {
        setError('Template not found or server is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  /**
   * Replace {{varName}} placeholders with user values.
   * Unfilled placeholders get a yellow highlight so they're visible.
   */
  const resolveVariables = (html) =>
    html.replace(/\{\{(\w+)\}\}/g, (match, name) => {
      const val = varValues[name];
      return val
        ? val
        : `<span style="background:#fef9c3;color:#92400e;padding:0 4px;border-radius:3px;font-weight:700;">${match}</span>`;
    });

  const renderedHtml = template ? resolveVariables(template.htmlContent) : '';

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: `3px solid ${theme.border}`, borderTopColor: theme.accent, animation: 'spinBorder 0.8s linear infinite' }} />
        <p style={{ color: theme.textMuted, fontSize: '14px' }}>Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ padding: '20px 28px', borderRadius: '14px', backgroundColor: theme.error, border: `1px solid ${theme.errorBorder}`, color: theme.errorText, fontSize: '14px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* ── Top Bar ───────────────────────────────────────────── */}
      <div
        className="glass"
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 24px', flexWrap: 'wrap', gap: '12px', flexShrink: 0,
          backgroundColor: theme.bgGlassStrong,
          backdropFilter: theme.blurNav, WebkitBackdropFilter: theme.blurNav,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '7px 14px', backgroundColor: theme.btnGhost, border: `1px solid ${theme.btnGhostBorder}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: theme.textSecondary }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '800', color: theme.textPrimary }}>{template.name}</h1>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '2px' }}>Subject: {template.subject}</p>
          </div>
        </div>

        {/* Right: viewport toggle + edit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle pill */}
          <div style={{
            display: 'flex', borderRadius: '10px', overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.previewToggleBg,
          }}>
            {['desktop', 'mobile'].map((vp) => (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                style={{
                  padding: '8px 16px', fontSize: '12px', fontWeight: '600',
                  border: 'none', cursor: 'pointer',
                  background: viewport === vp ? theme.toggleActiveBg : 'transparent',
                  color: viewport === vp ? '#fff' : theme.textMuted,
                  transition: 'background 0.2s, color 0.2s',
                }}
                title={`${vp === 'desktop' ? 'Desktop (600px)' : 'Mobile (375px)'}`}
              >
                {vp === 'desktop' ? '🖥 Desktop' : '📱 Mobile'}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate(`/edit/${id}`)}
            style={{ padding: '8px 18px', background: theme.btnPrimary, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: theme.shadowBtn }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + iframe ────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Variable sidebar — only shown when template has variables */}
        {template.variables.length > 0 && (
          <div
            className="glass"
            style={{
              width: '270px', minWidth: '250px', flexShrink: 0,
              backgroundColor: theme.bgGlassStrong,
              backdropFilter: theme.blur, WebkitBackdropFilter: theme.blur,
              borderRight: `1px solid ${theme.border}`,
              padding: '24px 18px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}
          >
            {/* Sidebar header */}
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: '800', color: theme.textPrimary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Variables
              </h3>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '5px', lineHeight: '1.5' }}>
                Live-fill placeholders to preview real content.
              </p>
            </div>

            {/* Variable inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {template.variables.map((varName) => (
                <div key={varName} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', color: theme.textSecondary, fontWeight: '600' }}>
                    <span style={{ backgroundColor: theme.bgTag, color: theme.textTag, padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', border: `1px solid ${theme.border}` }}>
                      {`{{${varName}}}`}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={varValues[varName] || ''}
                    onChange={(e) => setVarValues((p) => ({ ...p, [varName]: e.target.value }))}
                    placeholder={`Enter ${varName}...`}
                    style={{
                      padding: '8px 10px', fontSize: '13px', borderRadius: '8px',
                      border: `1px solid ${theme.borderInput}`,
                      backgroundColor: theme.bgInput, color: theme.textPrimary,
                      outline: 'none', width: '100%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Clear button */}
            <button
              onClick={() => {
                const c = {};
                template.variables.forEach((v) => (c[v] = ''));
                setVarValues(c);
              }}
              style={{ padding: '8px', backgroundColor: theme.bgClearBtn, border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '12px', color: theme.textMuted, cursor: 'pointer', textAlign: 'center' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* iframe preview area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Status bar */}
          <div style={{ padding: '8px 20px', backgroundColor: theme.previewBar, borderBottom: `1px solid ${theme.border}`, flexShrink: 0 }}>
            <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: 'monospace' }}>
              {viewport === 'desktop' ? '🖥' : '📱'} {VIEWPORT_WIDTHS[viewport]} — live preview
            </span>
          </div>

          {/* Scroll wrapper with dark canvas feel */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', backgroundColor: theme.previewBg }}>
            <iframe
              srcDoc={renderedHtml}
              title="Email Preview"
              sandbox="allow-same-origin"
              style={{
                width: VIEWPORT_WIDTHS[viewport],
                minHeight: '600px',
                height: 'auto',
                border: 'none',
                borderRadius: '8px',
                boxShadow: theme.shadowIframe,
                backgroundColor: '#ffffff',
                display: 'block',
                transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTemplate;
