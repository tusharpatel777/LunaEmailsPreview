import React, { createContext, useContext, useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — all color, blur, shadow, and gradient values live here.
// Swap between `dark` and `light` objects to theme the entire app.
// ─────────────────────────────────────────────────────────────────────────────

const dark = {
  // ── Backgrounds ─────────────────────────────
  bgPage:        '#050510',                              // Fixed page base
  bgGlass:       'rgba(255, 255, 255, 0.04)',            // Card surface
  bgGlassHover:  'rgba(255, 255, 255, 0.08)',            // Card hover
  bgGlassStrong: 'rgba(255, 255, 255, 0.07)',            // Navbar / sidebar
  bgInput:       'rgba(255, 255, 255, 0.06)',            // Input fields
  bgFooter:      'rgba(0, 0, 0, 0.25)',                  // Card footer strip
  bgTag:         'rgba(167, 139, 250, 0.15)',            // Variable badge bg
  bgClearBtn:    'rgba(255, 255, 255, 0.05)',

  // ── Borders ─────────────────────────────────
  border:        'rgba(255, 255, 255, 0.09)',
  borderStrong:  'rgba(255, 255, 255, 0.18)',
  borderAccent:  'rgba(129, 140, 248, 0.4)',
  borderInput:   'rgba(255, 255, 255, 0.12)',
  borderFooter:  'rgba(255, 255, 255, 0.06)',

  // ── Text ────────────────────────────────────
  textPrimary:   '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',
  textAccent:    '#818cf8',
  textTag:       '#c4b5fd',

  // ── Accent / Brand ──────────────────────────
  accent:        '#818cf8',                              // Indigo-400
  accentCyan:    '#22d3ee',                              // Cyan-400
  accentPurple:  '#a78bfa',                              // Violet-400
  accentGlow:    'rgba(129, 140, 248, 0.25)',
  accentCyanGlow:'rgba(34, 211, 238, 0.2)',

  // ── Buttons ─────────────────────────────────
  btnPrimary:    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  btnGhost:      'rgba(255, 255, 255, 0.05)',
  btnGhostBorder:'rgba(255, 255, 255, 0.12)',
  btnView:       'rgba(99, 102, 241, 0.15)',
  btnViewText:   '#818cf8',
  btnEdit:       'rgba(16, 185, 129, 0.12)',
  btnEditText:   '#34d399',
  btnDelete:     'rgba(239, 68, 68, 0.12)',
  btnDeleteText: '#f87171',

  // ── Status ──────────────────────────────────
  error:         'rgba(239, 68, 68, 0.12)',
  errorBorder:   'rgba(239, 68, 68, 0.3)',
  errorText:     '#f87171',

  // ── Shadows ─────────────────────────────────
  shadowCard:    '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
  shadowGlow:    '0 0 40px rgba(129,140,248,0.15)',
  shadowNav:     '0 4px 30px rgba(0,0,0,0.6)',
  shadowBtn:     '0 4px 20px rgba(99,102,241,0.4)',
  shadowIframe:  '0 20px 60px rgba(0,0,0,0.7)',

  // ── Blur ────────────────────────────────────
  blur:          'blur(20px)',
  blurNav:       'blur(24px)',

  // ── Orbs (animated bg blobs) ────────────────
  orb1:          'radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 70%)',
  orb2:          'radial-gradient(circle, rgba(8,145,178,0.35) 0%, transparent 70%)',
  orb3:          'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)',

  // ── Preview page ────────────────────────────
  previewBg:     '#0c0c1e',
  previewBar:    'rgba(255,255,255,0.03)',
  previewToggleBg: 'rgba(255,255,255,0.06)',
  toggleActiveBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
};

const light = {
  // ── Backgrounds ─────────────────────────────
  bgPage:        '#f5f3ff',
  bgGlass:       'rgba(255, 255, 255, 0.65)',
  bgGlassHover:  'rgba(255, 255, 255, 0.85)',
  bgGlassStrong: 'rgba(255, 255, 255, 0.75)',
  bgInput:       'rgba(255, 255, 255, 0.8)',
  bgFooter:      'rgba(255, 255, 255, 0.45)',
  bgTag:         'rgba(124, 58, 237, 0.08)',
  bgClearBtn:    'rgba(99, 102, 241, 0.06)',

  // ── Borders ─────────────────────────────────
  border:        'rgba(99, 102, 241, 0.12)',
  borderStrong:  'rgba(99, 102, 241, 0.25)',
  borderAccent:  'rgba(79, 70, 229, 0.4)',
  borderInput:   'rgba(99, 102, 241, 0.2)',
  borderFooter:  'rgba(99, 102, 241, 0.08)',

  // ── Text ────────────────────────────────────
  textPrimary:   '#1e1b4b',
  textSecondary: '#4b5563',
  textMuted:     '#9ca3af',
  textAccent:    '#4f46e5',
  textTag:       '#7c3aed',

  // ── Accent / Brand ──────────────────────────
  accent:        '#4f46e5',
  accentCyan:    '#0891b2',
  accentPurple:  '#7c3aed',
  accentGlow:    'rgba(79, 70, 229, 0.18)',
  accentCyanGlow:'rgba(8, 145, 178, 0.12)',

  // ── Buttons ─────────────────────────────────
  btnPrimary:    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  btnGhost:      'rgba(99, 102, 241, 0.06)',
  btnGhostBorder:'rgba(99, 102, 241, 0.2)',
  btnView:       'rgba(79, 70, 229, 0.08)',
  btnViewText:   '#4f46e5',
  btnEdit:       'rgba(5, 150, 105, 0.08)',
  btnEditText:   '#059669',
  btnDelete:     'rgba(220, 38, 38, 0.07)',
  btnDeleteText: '#dc2626',

  // ── Status ──────────────────────────────────
  error:         'rgba(220, 38, 38, 0.06)',
  errorBorder:   'rgba(220, 38, 38, 0.25)',
  errorText:     '#dc2626',

  // ── Shadows ─────────────────────────────────
  shadowCard:    '0 8px 32px rgba(99,102,241,0.1), 0 0 0 1px rgba(255,255,255,0.7)',
  shadowGlow:    '0 0 40px rgba(79,70,229,0.1)',
  shadowNav:     '0 4px 30px rgba(99,102,241,0.08)',
  shadowBtn:     '0 4px 20px rgba(79,70,229,0.3)',
  shadowIframe:  '0 20px 60px rgba(99,102,241,0.2)',

  // ── Blur ────────────────────────────────────
  blur:          'blur(20px)',
  blurNav:       'blur(24px)',

  // ── Orbs ────────────────────────────────────
  orb1:          'radial-gradient(circle, rgba(196,181,253,0.7) 0%, transparent 70%)',
  orb2:          'radial-gradient(circle, rgba(147,197,253,0.6) 0%, transparent 70%)',
  orb3:          'radial-gradient(circle, rgba(249,168,212,0.5) 0%, transparent 70%)',

  // ── Preview page ────────────────────────────
  previewBg:     '#ede9fe',
  previewBar:    'rgba(255,255,255,0.5)',
  previewToggleBg: 'rgba(99,102,241,0.07)',
  toggleActiveBg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default to dark mode; persist preference in localStorage
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('luna-theme');
    return saved ? saved === 'dark' : true;
  });

  // Sync data-theme attribute so global.css animations can key off it
  useEffect(() => {
    localStorage.setItem('luna-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);
  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** Hook — use inside any component: const { theme, isDark, toggle } = useTheme() */
export const useTheme = () => useContext(ThemeContext);
