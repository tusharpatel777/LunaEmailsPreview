import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTemplate } from '../api/templateApi';
import HtmlEditor from '../components/HtmlEditor';

/**
 * CreateTemplate Page
 *
 * Form to create a new email template.
 * Fields: name, subject, htmlContent (via HtmlEditor component).
 * On submit → POST /api/templates → redirect to template list.
 */
const CreateTemplate = () => {
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    name: '',
    subject: '',
    htmlContent: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generic handler for text inputs
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // HtmlEditor passes the raw string value directly
  const handleHtmlChange = (value) => {
    setForm((prev) => ({ ...prev, htmlContent: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!form.name.trim() || !form.subject.trim() || !form.htmlContent.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      await createTemplate(form);
      navigate('/'); // Go back to list on success
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create template.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Page header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 style={styles.title}>Create New Template</h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Error banner */}
        {error && <div style={styles.errorBanner}>{error}</div>}

        {/* Template Name */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Template Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. Welcome Email, Order Confirmation"
            style={styles.input}
          />
        </div>

        {/* Subject Line */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email Subject *</label>
          <input
            type="text"
            value={form.subject}
            onChange={handleChange('subject')}
            placeholder="e.g. Welcome to our platform, {{name}}!"
            style={styles.input}
          />
        </div>

        {/* HTML Editor */}
        <div style={styles.fieldGroup}>
          <HtmlEditor value={form.htmlContent} onChange={handleHtmlChange} />
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '28px',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '7px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#374151',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    color: '#111827',
    backgroundColor: '#fff',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#dc2626',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#374151',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default CreateTemplate;
