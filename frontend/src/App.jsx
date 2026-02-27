import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import TemplateList from './pages/TemplateList';
import CreateTemplate from './pages/CreateTemplate';
import EditTemplate from './pages/EditTemplate';
import PreviewTemplate from './pages/PreviewTemplate';

/**
 * App — Root component
 *
 * Sets up client-side routing with React Router v6.
 *
 * Routes:
 *  /                 → TemplateList   (all templates)
 *  /create           → CreateTemplate (new template form)
 *  /edit/:id         → EditTemplate   (edit existing template)
 *  /preview/:id      → PreviewTemplate (iframe preview + variable form)
 *
 * Navbar is rendered outside Routes so it appears on every page.
 * PreviewTemplate hides it implicitly via full-height layout.
 */
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TemplateList />} />
        <Route path="/create" element={<CreateTemplate />} />
        <Route path="/edit/:id" element={<EditTemplate />} />
        <Route path="/preview/:id" element={<PreviewTemplate />} />
        {/* Catch-all: redirect unknown routes back to home */}
        <Route
          path="*"
          element={
            <div style={styles.notFound}>
              <h2>404 — Page not found</h2>
              <a href="/" style={styles.homeLink}>
                Go home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const styles = {
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
    color: '#6b7280',
  },
  homeLink: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default App;
