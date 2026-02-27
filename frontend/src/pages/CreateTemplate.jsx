import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTemplate } from '../api/templateApi';
import HtmlEditor from '../components/HtmlEditor';
import { useTheme } from '../context/ThemeContext';
import { Field, GlassInput, GhostBtn, PrimaryBtn } from './_formComponents';

/**
 * CreateTemplate — glassmorphism form to create a new email template.
 * POST /api/templates → redirect to list on success.
 */
const CreateTemplate = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', subject: '', htmlContent: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.subject.trim() || !form.htmlContent.trim()) {
      setError('All three fields are required.');
      return;
    }
    try {
      setSubmitting(true);
      await createTemplate(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create template.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}
         className="fade-slide-up">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <GhostBtn onClick={() => navigate('/')} theme={theme}>← Back</GhostBtn>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: theme.textPrimary, letterSpacing: '-0.4px' }}>
            Create Template
          </h1>
          <p style={{ fontSize: '13px', color: theme.textMuted, marginTop: '3px' }}>
            Build a new HTML email template
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
        {/* Error banner */}
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
            <GlassInput value={form.name} onChange={handleChange('name')} placeholder="e.g. Welcome Email" theme={theme} />
          </Field>
          <Field label="Email Subject *" theme={theme}>
            <GlassInput value={form.subject} onChange={handleChange('subject')} placeholder="e.g. Welcome, {{name}}!" theme={theme} />
          </Field>
        </div>

        {/* HTML editor (full width) */}
        <HtmlEditor
          value={form.htmlContent}
          onChange={(val) => setForm((p) => ({ ...p, htmlContent: val }))}
        />

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
          <GhostBtn onClick={() => navigate('/')} theme={theme}>Cancel</GhostBtn>
          <PrimaryBtn type="submit" disabled={submitting} theme={theme}>
            {submitting ? 'Creating...' : 'Create Template'}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;
