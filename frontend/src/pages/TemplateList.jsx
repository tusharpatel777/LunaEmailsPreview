import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates, deleteTemplate } from '../api/templateApi';

/**
 * TemplateList Page
 *
 * Displays all email templates in a card grid.
 * Actions per card: View (preview), Edit, Delete.
 * Soft delete is handled — deleted templates disappear from list.
 */
const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getAllTemplates();
      setTemplates(data.data);
    } catch (err) {
      setError('Failed to load templates. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // Handle soft delete with confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await deleteTemplate(id);
      // Remove from local state without refetching
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete template. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date to readable string
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <div style={styles.center}>Loading templates...</div>;
  if (error) return <div style={{ ...styles.center, color: '#ef4444' }}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Email Templates</h1>
          <p style={styles.subtitle}>
            {templates.length} template{templates.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button style={styles.createBtn} onClick={() => navigate('/create')}>
          + New Template
        </button>
      </div>

      {/* Empty state */}
      {templates.length === 0 && (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📧</div>
          <h3 style={styles.emptyTitle}>No templates yet</h3>
          <p style={styles.emptyText}>Create your first email template to get started.</p>
          <button style={styles.createBtn} onClick={() => navigate('/create')}>
            Create Template
          </button>
        </div>
      )}

      {/* Template cards grid */}
      <div style={styles.grid}>
        {templates.map((template) => (
          <div key={template._id} style={styles.card}>
            <div style={styles.cardBody}>
              <h2 style={styles.cardTitle}>{template.name}</h2>
              <p style={styles.cardSubject}>
                <span style={styles.label}>Subject:</span> {template.subject}
              </p>
              {template.variables.length > 0 && (
                <div style={styles.variables}>
                  {template.variables.map((v) => (
                    <span key={v} style={styles.variableTag}>
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div style={styles.cardFooter}>
              <span style={styles.date}>{formatDate(template.createdAt)}</span>
              <div style={styles.actions}>
                <button
                  style={{ ...styles.btn, ...styles.btnView }}
                  onClick={() => navigate(`/preview/${template._id}`)}
                  title="Preview template"
                >
                  View
                </button>
                <button
                  style={{ ...styles.btn, ...styles.btnEdit }}
                  onClick={() => navigate(`/edit/${template._id}`)}
                  title="Edit template"
                >
                  Edit
                </button>
                <button
                  style={{ ...styles.btn, ...styles.btnDelete }}
                  onClick={() => handleDelete(template._id, template.name)}
                  disabled={deletingId === template._id}
                  title="Delete template"
                >
                  {deletingId === template._id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  createBtn: {
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  },
  cardSubject: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '12px',
  },
  label: {
    fontWeight: '600',
    color: '#374151',
  },
  variables: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  },
  variableTag: {
    backgroundColor: '#ede9fe',
    color: '#7c3aed',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '100px',
    fontFamily: 'monospace',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderTop: '1px solid #f3f4f6',
    backgroundColor: '#f9fafb',
  },
  date: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  btn: {
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
  },
  btnView: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  btnEdit: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  btnDelete: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    fontSize: '16px',
    color: '#6b7280',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '24px',
  },
};

export default TemplateList;
