import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTemplateById, updateTemplate } from '../api/templateApi';
import HtmlEditor from '../components/HtmlEditor';
import { useTheme } from '../context/ThemeContext';
import { Field, GlassInput, GhostBtn, PrimaryBtn, AccentBtn } from './_formComponents';

/**
 * EditTemplate — pre-loads an existing template and lets the user update it.
 * PUT /api/templates/:id → redirect to list on success.
 */
const EditTemplate = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', subject: '', htmlContent: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form with existing template data
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getTemplateById(id);
        const t = data.data;
        setForm({ name: t.name, subject: t.subject, htmlContent: t.htmlContent });
      } catch {
        setError('Failed to load template. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.subject.trim() || !form.htmlContent.trim()) {
      setError('All fields are required.');
      return;
    }
    try {
      setSubmitting(true);
      await updateTemplate(id, form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update template.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading spinner ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: `3px solid ${theme.border}`,
          borderTopColor: theme.accent,
          animation: 'spinBorder 0.8s linear infinite',
        }} />
        <p style={{ color: theme.textMuted, fontSize: '14px' }}>Loading template...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}
         className="fade-slide-up">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <GhostBtn onClick={() => navigate('/')} theme={theme}>← Back</GhostBtn>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.4px' }}>
            Edit Template
          </h1>
          <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '3px' }}>
            Update HTML content, subject, or name
          </p>
        </div>
      </div>

      {/* ── Glass Form Card ─────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="glass"
        style={{
          backgroundColor: theme.bgGlass,
          backdropFilter: theme.blur,
          WebkitBackdropFilter: theme.blur,
          borderRadius: '20px',
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowCard,
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {error && (
          <div style={{
            backgroundColor: theme.error,
            border: `1px solid ${theme.errorBorder}`,
            borderRadius: '10px',
            padding: '12px 16px',
            color: theme.errorText,
            fontSize: '13px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Name + Subject row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Field label="Template Name *" theme={theme}>
            <GlassInput value={form.name} onChange={handleChange('name')} placeholder="Template name" theme={theme} />
          </Field>
          <Field label="Email Subject *" theme={theme}>
            <GlassInput value={form.subject} onChange={handleChange('subject')} placeholder="Email subject" theme={theme} />
          </Field>
        </div>

        {/* HTML editor */}
        <HtmlEditor
          value={form.htmlContent}
          onChange={(val) => setForm((p) => ({ ...p, htmlContent: val }))}
        />

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
          <GhostBtn onClick={() => navigate('/')} theme={theme}>Cancel</GhostBtn>
          <AccentBtn onClick={() => navigate(`/preview/${id}`)} theme={theme}>
            👁 Preview
          </AccentBtn>
          <PrimaryBtn type="submit" disabled={submitting} theme={theme}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

export default EditTemplate;
