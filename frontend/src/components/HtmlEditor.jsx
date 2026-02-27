import React from 'react';

/**
 * HtmlEditor Component
 *
 * A simple, large textarea for pasting and editing raw HTML email content.
 * Controlled component — value and onChange are managed by the parent.
 *
 * Props:
 *  - value    : Current HTML string
 *  - onChange : Callback to update HTML in parent state
 */
const HtmlEditor = ({ value, onChange }) => {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>HTML Content</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your full HTML email code here...&#10;&#10;Tip: Use {{variableName}} for dynamic placeholders, e.g. {{name}}, {{order_id}}"
        spellCheck={false}
        style={styles.textarea}
      />
      <p style={styles.hint}>
        Use <code style={styles.code}>{'{{variableName}}'}</code> for dynamic
        placeholders. They can be filled in on the preview page.
      </p>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
  },
  textarea: {
    width: '100%',
    minHeight: '400px',
    padding: '12px 14px',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#1e1e2e',
    color: '#cdd6f4',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
  },
  code: {
    backgroundColor: '#f3f4f6',
    padding: '1px 5px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#7c3aed',
  },
};

export default HtmlEditor;
