import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import TemplateList from './pages/TemplateList';
import CreateTemplate from './pages/CreateTemplate';
import EditTemplate from './pages/EditTemplate';
import PreviewTemplate from './pages/PreviewTemplate';

/**
 * AppShell — lives inside ThemeProvider so it can read the theme.
 * Renders the fixed animated background orbs + all routes.
 */
const AppShell = () => {
  const { theme, isDark } = useTheme();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ── Animated gradient orb background (fixed, behind all content) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: theme.bgPage,
        overflow: 'hidden',
        zIndex: 0,
        transition: 'background-color 0.5s ease',
      }}>
        {/* Orb 1 — top-left */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-8%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: theme.orb1,
          filter: 'blur(60px)',
          animation: 'orbFloat1 22s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* Orb 2 — bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-8%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: theme.orb2,
          filter: 'blur(60px)',
          animation: 'orbFloat2 28s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* Orb 3 — center-right, smaller accent */}
        <div style={{
          position: 'absolute',
          top: '35%',
          right: '15%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: theme.orb3,
          filter: 'blur(50px)',
          animation: 'orbFloat3 18s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* Subtle grid overlay for futuristic feel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(79,70,229,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── Main content (above background) ─────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"           element={<TemplateList />} />
            <Route path="/create"     element={<CreateTemplate />} />
            <Route path="/edit/:id"   element={<EditTemplate />} />
            <Route path="/preview/:id" element={<PreviewTemplate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

/** 404 page */
const NotFound = () => {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
      <h2 style={{ fontSize: '28px', color: theme.textPrimary }}>404</h2>
      <p style={{ color: theme.textSecondary }}>Page not found</p>
      <a href="/" style={{ color: theme.accent, textDecoration: 'none', fontWeight: '600' }}>← Go home</a>
    </div>
  );
};

/**
 * App — wraps everything in ThemeProvider then BrowserRouter.
 * Order matters: ThemeProvider must be outermost so Navbar (inside Router)
 * can call useTheme safely.
 */
const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
