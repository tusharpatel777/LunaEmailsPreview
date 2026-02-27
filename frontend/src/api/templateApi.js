import axios from 'axios';

/**
 * Axios instance configured for the Email Preview backend API.
 *
 * Base URL points to the Express server. During development, Vite proxies
 * /api/* to http://localhost:5000 so no CORS issues arise.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────────────────────
// Template API Methods
// Each function returns the response data (unwrapped from axios response)
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all templates (list view — no htmlContent in response).
 * @returns {Promise<Object[]>} Array of template summary objects
 */
export const getAllTemplates = async () => {
  const res = await api.get('/templates');
  return res.data;
};

/**
 * Fetch a single template by its ID (includes full htmlContent).
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<Object>} Full template object
 */
export const getTemplateById = async (id) => {
  const res = await api.get(`/templates/${id}`);
  return res.data;
};

/**
 * Create a new email template.
 * @param {Object} templateData - { name, subject, htmlContent }
 * @returns {Promise<Object>} Created template object
 */
export const createTemplate = async (templateData) => {
  const res = await api.post('/templates', templateData);
  return res.data;
};

/**
 * Update an existing template by ID.
 * @param {string} id - MongoDB ObjectId string
 * @param {Object} templateData - Fields to update
 * @returns {Promise<Object>} Updated template object
 */
export const updateTemplate = async (id, templateData) => {
  const res = await api.put(`/templates/${id}`, templateData);
  return res.data;
};

/**
 * Soft-delete a template by ID.
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<Object>} Success message
 */
export const deleteTemplate = async (id) => {
  const res = await api.delete(`/templates/${id}`);
  return res.data;
};
