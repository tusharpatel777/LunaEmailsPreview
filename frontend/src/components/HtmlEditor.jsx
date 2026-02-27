import { useTheme } from '../context/ThemeContext';

/**
 * HtmlEditor — glass-morphism raw HTML textarea.
 * Dark theme keeps the classic code-editor feel (dark surface).
 * Light theme uses a frosted glass surface.
 *
 * Props:
 *  value    — controlled HTML string
 *  onChange — (value: string) => void
 */
const HtmlEditor = ({ value, onChange }) => {
  const { theme, isDark } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontWeight: '600', fontSize: '13px', color: theme.textSecondary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          HTML Content
        </label>
        {/* Character counter */}
        <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: 'monospace' }}>
          {value.length.toLocaleString()} chars
        </span>
      </div>

      {/* Editor surface */}
      <div style={{
        borderRadius: '12px',
        border: `1px solid ${theme.borderInput}`,
        overflow: 'hidden',
        boxShadow: theme.shadowCard,
      }}>

        {/* Faux editor tab bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 14px',
          backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(99,102,241,0.06)',
          borderBottom: `1px solid ${theme.borderInput}`,
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f87171', opacity: 0.8 }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fbbf24', opacity: 0.8 }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#34d399', opacity: 0.8 }} />
          <span style={{ marginLeft: '8px', fontSize: '11px', color: theme.textMuted, fontFamily: 'monospace' }}>template.html</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'<!-- Paste your full HTML email here -->\n\nTip: use {{variableName}} for dynamic placeholders\ne.g. <p>Hello {{name}}, your order {{order_id}} is ready!</p>'}
          spellCheck={false}
          style={{
            width: '100%',
            minHeight: '420px',
            padding: '16px',
            fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.7',
            backgroundColor: isDark ? 'rgba(5,5,20,0.8)' : 'rgba(248,246,255,0.9)',
            color: isDark ? '#c8d3f5' : '#1e1b4b',
            resize: 'vertical',
            outline: 'none',
            border: 'none',
            display: 'block',
            backdropFilter: theme.blur,
            WebkitBackdropFilter: theme.blur,
          }}
        />
      </div>

      <p style={{ fontSize: '12px', color: theme.textMuted, lineHeight: '1.6' }}>
        Use{' '}
        <code style={{
          backgroundColor: theme.bgTag,
          color: theme.textTag,
          padding: '1px 6px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '11px',
          border: `1px solid ${theme.border}`,
        }}>
          {'{{variableName}}'}
        </code>
        {' '}for dynamic placeholders — fill them in on the preview page.
      </p>
    </div>
  );
};

export default HtmlEditor;
